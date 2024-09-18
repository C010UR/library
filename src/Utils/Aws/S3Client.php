<?php

namespace App\Utils\Aws;

use App\Utils\Aws\Exception\AwsException;
use App\Utils\Environment;
use App\Utils\Utils;
use Aws\S3\S3Client as BaseS3Client;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;
use Imagine\Image\ImageInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class S3Client
{
    private const string EXPIRES_AFTER = '+7 days';

    private const int IMAGE_MAX_SIZE = 4096;

    private readonly string $bucket;

    private static array $clients = [];

    private readonly BaseS3Client $client;

    private function getClient(string $bucket): ?BaseS3Client
    {
        if (array_key_exists($bucket, self::$clients)) {
            return self::$clients[$bucket];
        }

        return null;
    }

    private function initClient(
        string $bucket,
        string $endpoint,
        string $region,
        string $accessKey,
        string $secretKey,
    ): BaseS3Client {
        if (Environment::isDev()) {
            $client = new BaseS3Client([
                'region' => $region,
                'version' => 'latest',
                'endpoint' => $endpoint,
                'credentials' => [
                    'key' => $accessKey,
                    'secret' => $secretKey,
                ],
                'force_path_style' => true,
                'use_path_style_endpoint' => true,
            ]);

            $bucketExists = false;
            $buckets = $client->listBuckets();

            foreach ($buckets['Buckets'] as $_bucket) {
                if ($_bucket['Name'] === $bucket) {
                    $bucketExists = true;
                    break;
                }
            }

            if (!$bucketExists) {
                $client->createBucket([
                    'Bucket' => $bucket,
                ]);
            }
        } else {
            $client = new BaseS3Client([
                'region' => $region,
                'version' => 'latest',
                'endpoint' => $endpoint,
                'credentials' => [
                    'key' => $accessKey,
                    'secret' => $secretKey,
                ],
            ]);
        }

        return $client;
    }

    public function __construct(?string $bucket = null)
    {
        $bucket = $bucket ?: $_ENV['AWS_S3_BUCKET'];
        $this->bucket = $bucket;

        $client = $this->getClient($bucket);

        if (!$client instanceof BaseS3Client) {
            $upperBucket = strtoupper((string) $bucket);

            $endpoint = $_ENV['AWS_S3_ENDPOINT'] ?? null;
            $region = $_ENV[sprintf('AWS_S3_BUCKET_%s_REGION', $upperBucket)];
            $accessKey = $_ENV[sprintf('AWS_S3_BUCKET_%s_KEY', $upperBucket)];
            $secretKey = $_ENV[sprintf('AWS_S3_BUCKET_%s_SECRET', $upperBucket)];

            $client = $this->initClient($bucket, $endpoint, $region, $accessKey, $secretKey);
        }

        $this->client = $client;
    }

    private function generateKey(string $filePath, string $prefix = ''): string
    {
        $prefix = trim($prefix, " \n\r\t\v\0\\/");
        $prefix = '' !== $prefix ? $prefix.'/' : '';

        return sprintf(
            '%s%s-%s.%s',
            $prefix,
            substr(bin2hex(random_bytes(10)), 0, 10),
            (new \DateTime())->format('Y-m-d-H-i-s'),
            pathinfo($filePath, PATHINFO_EXTENSION) ?? 'bin',
        );
    }

    public function getBucket(): string
    {
        return $this->bucket;
    }

    public function upload(mixed $file, string $prefix = ''): string
    {
        $filePath = '';

        if ($file instanceof UploadedFile) {
            $filePath = $file->getPathname();
        } elseif (is_string($file)) {
            $filePath = $file;
        } elseif (is_resource($file)) {
            $filePath = stream_get_meta_data($file)['uri'] ?? false;

            $components = parse_url($filePath);
            if (isset($components['scheme']) && 'file' !== $components['scheme']) {
                throw new \LogicException(sprintf('Resource "%s" is not a file', $filePath));
            }
        } else {
            throw new \LogicException(sprintf('Unsupported type "%s"', gettype($file)));
        }

        if (!file_exists($filePath) || !is_file($filePath)) {
            throw new \LogicException(sprintf('File "%s" does not exist or is a directory', $filePath));
        }

        $key = $this->generateKey($filePath, $prefix);

        $result = $this->client->putObject([
            'Bucket' => $this->bucket,
            'Key' => $key,
            'SourceFile' => $filePath,
        ]);

        if (!($result['ObjectURL'] ?? false)) {
            throw new AwsException(sprintf('Error uploading the file "%s" to S3 bucket "%s"', $filePath, $this->bucket));
        }

        return $key;
    }

    public function uploadImage(UploadedFile $file, string $prefix = ''): string
    {
        [$iwidth, $iheight] = getimagesize($file->getPathname());

        $ratio = $iwidth / $iheight;

        $width = self::IMAGE_MAX_SIZE;
        $height = self::IMAGE_MAX_SIZE;

        if ($width / $height > $ratio) {
            $width = $height * $ratio;
        } else {
            $height = $width / $ratio;
        }

        $imagine = new Imagine();

        $photo = $imagine->open($file->getPathname());
        $photo
            ->resize(new Box($width, $height), ImageInterface::FILTER_LANCZOS)
            ->save($file->getPathname());

        return $this->upload($file, $prefix);
    }

    public function getLink(string $filename, string $originalFilename, bool $isAttachment = true): string
    {
        $filename = urlencode($filename);
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        if ('' !== $originalFilename) {
            $originalExtension = strtolower(pathinfo($originalFilename, PATHINFO_EXTENSION));

            if ($extension !== $originalExtension) {
                $originalFilename .= '.'.$extension;
            }
        } else {
            $originalFilename = $filename;
        }

        $command = $this->client->getCommand('GetObject', [
            'Bucket' => $this->bucket,
            'Key' => $filename,
            'ResponseContentDisposition' => sprintf(
                '%s;filename="%s"',
                $isAttachment ? 'attachment' : 'inline',
                basename($originalFilename),
            ),
            'ResponseContentType' => Utils::extensionToContentType($extension),
        ]);

        $expiryDate = new \DateTime(self::EXPIRES_AFTER);

        return (string) $this->client->createPresignedRequest($command, $expiryDate)->getUri();
    }

    public function getFile(string $filename): string
    {
        $result = $this->client->getObject([
            'Bucket' => $this->bucket,
            'Key' => urlencode($filename),
        ]);

        return $result['Body'];
    }
}
