import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { parse } from "../services/SensorService";
import { handleOnLoadProps } from "../types";

type FormProps = {
  handleOnLoad: (quality: handleOnLoadProps) => void;
};

const Form = ({ handleOnLoad }: FormProps) => {
  const FormSchema = z.object({
    logfile: z
      .instanceof(FileList)
      .refine((files) => files?.length == 1, "A log file is required.")
      .transform((list) => list[0])
      .refine(
        (file) => file!.size <= 10 * 1024 * 1024,
        "The file must be less than 10 MB"
      ),
  });

  type FormType = z.infer<typeof FormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
  });

  async function handleUpload(data: FormType) {
    if (data.logfile) {
      const result = (await parse(data.logfile)) as handleOnLoadProps;
      handleOnLoad(result);
    } else {
      console.log("Failed to load file");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleUpload)}
      className="h-50 bg-zinc-200 rounded shadow-md w-full max-w-sm items-center justify-center flex"
    >
      <div className="flex flex-col gap-4 p-3">
        <input
          type="file"
          accept=".txt"
          {...register("logfile")}
          className="border border-emerald-700 rounded p-3 bg-emerald-400"
        />
        {errors.logfile && (
          <span className="text-red-500 text-sm">{errors.logfile.message}</span>
        )}
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-400 shadow-sm border border-emerald-700 mt-6"
        >
          Upload
        </button>
      </div>
    </form>
  );
};

export default Form;
