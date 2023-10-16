import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { parse } from '../services/SensorService'

const Form = () => {
  const FormSchema = z.object({
    logfile: z.instanceof(FileList)
    .transform(list => list[0])
    .refine(file => file!.size <= 10 * 1024 * 1024, 'The file must be less than 10 MB')
  })
  
  type FormType = z.infer<typeof FormSchema>
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormType>({
    resolver: zodResolver(FormSchema)
  })

  async function handleUpload(data: FormType) {
    
    if (data.logfile) {
      

      const result = await parse(data.logfile)

      console.log(result)
      // const fileReader = new FileReader();
      // fileReader.onload = function(e) { 
      //     const contents = e.target!.result;             
      //     const ct = fileReader.result;
      //     const lines = ct.split('\n')
      //     console.log({ lines })
      //     // const words = ct.split(' ');            
      //     // console.log(words);
      // }
      // fileReader.readAsText(data.logfile);
    } else { 
      console.log("Failed to load file");
    }
    // const formData = new FormData();
    // formData.append('file', data.logfile, data.logfile.name);
    // try {
    //   uploadFile(formData)
    // } catch (e) {
    //   console.log('error upload: ', e)
    // }
  }

  return (
    <form onSubmit={handleSubmit(handleUpload)} className="h-40 bg-zinc-800 w-full max-w-sm items-center justify-center">
      <div className="flex flex-col gap-4 p-3">
        <input
          type="file"
          accept='.txt'
          {...register('logfile')}
        />
        { errors.logfile && <span className="text-red-500 text-sm">{errors.logfile.message}</span>}
        <button type='submit'>Upload</button>
      </div>
    </form>
  )
}

export default Form