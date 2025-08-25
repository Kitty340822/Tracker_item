"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CreateUserSchema } from "@/lib/validations/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { UserPlus2 } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { getSignupList } from "@/lib/actions/api-employee.action";
import { toast } from "../ui/use-toast";

interface IAddUsrDialogProps {
  permissions: string[];
  successCallback: () => void;
}

// Define the form type based on the schema
type UserFormData = z.infer<typeof CreateUserSchema>;

const INIT_FORM: UserFormData = {
  name: "",
  password: "",
  email: "",
  phone: "",
  role_permission: "",
};

export const AddUserDialog = ({
  permissions,
  successCallback,
}: IAddUsrDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const usrForm = useForm<UserFormData>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: INIT_FORM,
  });

  const handlePermissionCheck = (perm: string) => {
    const newPermissions = selectedPermissions.includes(perm)
      ? selectedPermissions.filter((p) => p !== perm)
      : [...selectedPermissions, perm];
    
    setSelectedPermissions(newPermissions);
    
    // Convert array to comma-separated string for the form
    usrForm.setValue("role_permission", newPermissions.join(","));
  };

  const handleSubmit = async (values: UserFormData) => {
    try {
      setIsLoading(true);
      const { success, error } = await createEmployee(values);

      if (success) {
        successCallback();
        setOpen(false);
        usrForm.reset(INIT_FORM);
        setSelectedPermissions([]);
        toast({
          title: `User created: ${values.name}`,
          variant: "success",
        });
      } else {
        console.error("[ERROR]", error);
        const result = error?.includes("Duplicate") ? error : "Failed to create user";
        toast({
          title: `User create: ${result}`,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("[ERROR]", err?.message || err);
      toast({
        title: "An error occurred while creating user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      usrForm.reset(INIT_FORM);
      setSelectedPermissions([]);
    }
  }, [open, usrForm]);

  return (
    <Dialog open={open} onOpenChange={(b) => setOpen(b)}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 rounded-md bg-green-300 p-2 px-3 shadow-md hover:bg-green-200">
          <UserPlus2
            size={20}
            className="rounded-full bg-green-400 p-0.5 text-slate-600"
          />
          <span className="text-sm text-slate-700">New</span>
        </button>
      </DialogTrigger>
      <DialogContent className="custom-scrollbar max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create new user</DialogTitle>
          <DialogDescription>
            Fill in the information below to create a new user account.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <Form {...usrForm}>
          <form
            onSubmit={usrForm.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={usrForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Username</FormLabel>
                    <FormMessage className="text-xs italic text-red-500" />
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      id="name"
                      placeholder="Enter username"
                      className="no-focus no-active"
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={usrForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Email</FormLabel>
                    <FormMessage className="text-xs italic text-red-500" />
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      id="email"
                      placeholder="Enter email address"
                      className="no-focus no-active"
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={usrForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Password</FormLabel>
                    <FormMessage className="text-xs italic text-red-500" />
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      id="password"
                      placeholder="Enter password"
                      className="no-focus no-active"
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={usrForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormMessage className="text-xs italic text-red-500" />
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      id="phone"
                      placeholder="Enter phone number"
                      className="no-focus no-active"
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={usrForm.control}
              name="role_permission"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Permissions</FormLabel>
                    <FormMessage className="text-xs italic text-red-500" />
                  </div>
                  {/* Hidden input for the form value */}
                  <input type="hidden" {...field} />
                  <div className="mt-2 space-y-2 p-2 px-3 border rounded-md">
                    {permissions.map((p) => (
                      <div key={p} className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedPermissions.includes(p)}
                          onCheckedChange={() => handlePermissionCheck(p)}
                          disabled={isLoading}
                        />
                        <span className="text-sm">{p}</span>
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-400"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};