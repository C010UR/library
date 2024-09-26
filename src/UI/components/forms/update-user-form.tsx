import { zodResolver } from '@hookform/resolvers/zod';
import {ArrowLeft, X} from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatedButton, Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { User } from '@/types/types';
import { fileSchema, stringSchema } from '@/types/zod-schemas.ts';
import {useNavigate} from "react-router-dom";
import {useUpdateUser} from "@/components/hooks/use-user.tsx";

const formSchema = z.object({
  image: fileSchema().optional(),
  firstname: stringSchema({ min: 3, fieldName: 'First Name ' }),
  lastname: stringSchema({ min: 3, fieldName: 'Last Name ' }),
  middlename: stringSchema({ min: 0, fieldName: 'Middle Name ' }).optional(),
  contact_information: z.array(
    z.object({
      value: stringSchema({ min: 3, fieldName: 'Contact value' }),
      key: stringSchema({ min: 3, fieldName: 'Contact Name' }),
    }),
  ),
});

export type UpdateUserForm = z.infer<typeof formSchema>;

export default function UpdateUserForm({
  user,
  onSubmit,
}: {
  user: User;
  onSubmit: (values: UpdateUserForm) => void;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.image || null,
  );

  const form = useForm<UpdateUserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: user.image,
      firstname: user.firstname,
      lastname: user.lastname,
      middlename: user.middlename || '',
      contact_information: user.contact_information ?? undefined,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'contact_information',
  });

  const addContactField = () => {
    append({ key: '', value: '' });
  };

  const mutation = useUpdateUser(user);
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-3xl mx-auto bg-background/30">
      <CardHeader className="flex flex-row w-full justify-between">
        <div>
          <CardTitle className="text-2xl">Edit Profile</CardTitle>
        </div>
        <div>
          <Button size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="pr-1"/> Go Back
          </Button>
        </div>
      </CardHeader>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...field } }) => (
                <div className="flex space-x-2">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      alt={user.full_name}
                      src={imagePreview || undefined}
                    />
                    <AvatarFallback>
                      {user.firstname[0] ?? 'N'}
                      {user.lastname[0] ?? 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <FormItem className="flex-1">
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          accept="image/*"
                          type="file"
                          onChange={(e) => {
                            handleImageChange(e);
                            onChange(e.target.files?.[0]);
                          }}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="middlename"
              render={({ field }) => (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel className="grid gap-2 space-y-0">
                Contact Information
              </FormLabel>
              <Card className="bg-transparent">
                <CardContent className="pt-6 space-y-4">
                  {fields.map((field, index: number) => (
                    <div key={field.id} className="flex space-x-2 items-start">
                      <FormField
                        control={form.control}
                        name={`contact_information.${index}.key`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Contact Type" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`contact_information.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Contact Value" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        size="icon"
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addContactField}
                  >
                    Add Contact Field
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <AnimatedButton
              className="w-full"
              disabled={mutation.isPending}
              type="submit"
            >
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </AnimatedButton>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
