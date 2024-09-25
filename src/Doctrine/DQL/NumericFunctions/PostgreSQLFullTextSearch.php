<?php

namespace App\Doctrine\DQL\NumericFunctions;

use Doctrine\DBAL\Types\Type;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Query\AST\ArithmeticExpression;
use Doctrine\ORM\Query\AST\Functions\FunctionNode;
use Doctrine\ORM\Query\AST\TypedExpression;
use Doctrine\ORM\Query\Parser;
use Doctrine\ORM\Query\QueryException;
use Doctrine\ORM\Query\SqlWalker;
use Doctrine\ORM\Query\TokenType;

class PostgreSQLFullTextSearch extends FunctionNode implements TypedExpression
{
    public array $values;

    public ArithmeticExpression $keyword;

    #[\Override]
    public function getSql(SqlWalker $sqlWalker): string
    {
        if (1 === count($this->values)) {
            $tsVector = $sqlWalker->walkArithmeticExpression(reset($this->values));
        } else {
            $tsVector = sprintf(
                'CONCAT(%s)',
                implode(", ' ', ", array_map(fn ($value) => $sqlWalker->walkArithmeticExpression($value), $this->values)),
            );
        }

        $tsQuery = $sqlWalker->walkArithmeticExpression($this->keyword);

        return sprintf(
            '(to_tsvector(%s) @@ to_tsquery(%s))',
            $tsVector,
            $tsQuery,
        );
    }

    #[\Override]
    public function parse(Parser $parser): void
    {
        $parser->match(TokenType::T_IDENTIFIER);
        $parser->match(TokenType::T_OPEN_PARENTHESIS);

        $values = [$parser->ArithmeticExpression()];

        while (TokenType::T_COMMA === $parser->getLexer()->lookahead?->type) {
            $parser->match(TokenType::T_COMMA);
            $values[] = $parser->ArithmeticExpression();
        }

        if (count($values) < 2) {
            throw new QueryException('The FULL_TEXT_SEARCH function requires at least 2 arguments');
        }

        $this->keyword = array_pop($values);
        $this->values = $values;

        $parser->match(TokenType::T_CLOSE_PARENTHESIS);
    }

    #[\Override]
    public function getReturnType(): Type
    {
        return Type::getType(Types::BOOLEAN);
    }
}
