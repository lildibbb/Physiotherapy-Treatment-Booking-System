import type React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

// Schema definition for the meeting link form
const meetingLinkSchema = z.object({
  meetingLink: z
    .string()
    .url("Please enter a valid meeting link URL.")
    .min(1, "Meeting link is required."),
});

type MeetingLinkData = z.infer<typeof meetingLinkSchema>;

interface MeetingLinkFormProps {
  onSubmit: (data: MeetingLinkData) => Promise<Partial<MeetingLinkData> | null>;
}

const MeetingLinkForm: React.FC<MeetingLinkFormProps> = ({ onSubmit }) => {
  const form = useForm<MeetingLinkData>({
    resolver: zodResolver(meetingLinkSchema),
    defaultValues: {
      meetingLink: "",
    },
  });

  const handleSubmit = async (data: MeetingLinkData) => {
    try {
      await onSubmit(data);

      toast({
        title: "Meeting Link Added",
        description: "The meeting link has been added successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error Adding Meeting Link",
        description: "An error occurred while adding the meeting link.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Meeting Link */}
        <FormField
          control={form.control}
          name="meetingLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Link</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., https://meet.google.com/example"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full rounded-lg">
          Add Meeting Link
        </Button>
      </form>
    </Form>
  );
};

export default MeetingLinkForm;
