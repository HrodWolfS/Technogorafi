"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const commentSchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  content: z
    .string()
    .min(10, "Le commentaire doit faire au moins 10 caractères"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

export default function CommentForm({ articleId }: { articleId: string }) {
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      name: "",
      email: "",
      content: "",
    },
  });

  async function onSubmit(data: CommentFormValues) {
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          articleId,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du commentaire");
      }

      toast.success(
        "Commentaire envoyé avec succès ! Il sera visible après modération."
      );
      form.reset();
    } catch (error) {
      toast.error("Erreur lors de l'envoi du commentaire");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Votre nom"
                  {...field}
                  className="bg-primary/05"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="votreadresse@email.com"
                  {...field}
                  className="bg-primary/05"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Votre commentaire"
                  className="min-h-[100px] bg-primary/05"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full text-white">
          Envoyer
        </Button>
      </form>
    </Form>
  );
}
