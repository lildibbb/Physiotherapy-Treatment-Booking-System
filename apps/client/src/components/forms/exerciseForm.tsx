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

const exerciseSchema = z.object({
  name: z.string().min(1, "Please enter the exercise name."),
  description: z.string().min(1, "Please enter the exercise description."),
  videoURL: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url("Please enter a valid video URL.").optional()
  ),
  duration: z.number().min(1, "Please enter a valid duration (in minutes)."),
});

type ExerciseData = z.infer<typeof exerciseSchema>;

interface ExerciseFormProps {
  onSubmit: (data: ExerciseData) => Promise<Partial<ExerciseData> | null>;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ onSubmit }) => {
  const form = useForm<ExerciseData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: "",
      description: "",
      videoURL: "",
      duration: 0,
    },
  });

  const handleSubmit = async (data: ExerciseData) => {
    try {
      const response = await onSubmit(data);

      toast({
        title: "Exercise Created",
        description: "The exercise has been created successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error Creating Exercise",
        description: "An error occurred while creating the exercise.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Exercise Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Squats" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Exercise Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Perform 3 sets of 10 repetitions"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Video URL (Optional) */}
        <FormField
          control={form.control}
          name="videoURL"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., https://www.youtube.com/watch?v=example"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="e.g., 30"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full rounded-lg">
          Create Exercise
        </Button>
      </form>
    </Form>
  );
};

export default ExerciseForm;
