'use client'
import { useState } from 'react'
import {useForm, useFieldArray} from 'react-hook-form'
import {z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const createUserFormSchema = z.object({
  name: z.string().nonempty()
    .transform(nome => {
      return nome.trim().split(' ').map(palavra => {
        return palavra[0].toLocaleUpperCase().concat(palavra.substring(1))
      }).join(' ')
    })
    ,
  email: z.string()
    .nonempty("O e-mail é obrigatório")
    .email("Formato de e-mail inválido"),
  password: z.string()
    .min(6, 'A senha deve conter no mínimo 6 caracteres'),
  techs: z.array(z.object({
    title: z.string().nonempty("Este campo não pode ser vazio"),
    knowledge: z.coerce.number().min(1).max(100)
  })).min(2, 'Insira pelo menos duas tecnologias')

})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export default function Home() {

  const [output, setOutput] = useState('')
  const {register,
      handleSubmit,
      formState : {errors},
      control
    } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema)
  })

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'techs'
  })

  function AddTech(){
    append({
      title: '',
      knowledge: 0
    })
  }

  console.log(errors)

  function createUser(data : any){
    setOutput(JSON.stringify(data, null, 2))
  }

  return (
    <main className='flex flex-col gap-10 justify-center items-center pt-32'>
        <form className='flex flex-col gap-10 w-full max-w-sm' onSubmit={handleSubmit(createUser)}>
          <div className='flex flex-col'>
            <label htmlFor="">Nome</label>
            <input
              className='p-3 rounded border-zinc-200 shadow-sm border'
              {...register('name')}
              type="text"
            />
            {errors.name && <span className='text-red-400'>{errors.name.message}</span>}
          </div>

          <div className='flex flex-col'>
            <label htmlFor="">E-mail</label>
            <input
              className='p-3 rounded border-zinc-200 shadow-sm border'
              {...register('email')}
              type="text"
            />
            {errors.email && <span className='text-red-400'>{errors.email.message}</span>}
          </div>

          <div className='flex flex-col'>
            <label htmlFor="password">Password</label>
            <input
              className='p-3 rounded border-zinc-200 shadow-sm border'
              {...register('password')}
              type='password'
            />
            {errors.password && <span className='text-red-400'>{errors.password.message}</span>}
          </div>

          <div className='flex flex-col gap-3'>
            <label htmlFor="" className='flex items-center justify-between'>
              Tecnologias

              <button className='text-emerald-500' type='button' onClick={AddTech}>
                Adicionar
              </button>
            </label>

            {fields.map((field, index) => (
              <div key={field.id} className='flex w-full gap-2'>
                <div className='flex-1 w-full'>
                  <input
                    className='flex-1 p-3 rounded border-zinc-200 shadow-sm border'
                    {...register(`techs.${index}.title`)}
                    type='text'
                  />

                  {errors.techs?.[index]?.title && <span className='text-red-500'>{errors.techs?.[index]?.title?.message}</span>}
                </div>
                <div className='flex-1'>  
                  <input
                    className='p-3 rounded border-zinc-200 shadow-sm border w-[80px]'
                    {...register(`techs.${index}.knowledge`)}
                    type='number'
                  />

                  {errors.techs?.[index]?.knowledge && <span className='text-red-500'>{errors.techs?.[index]?.knowledge?.message}</span>}

                </div>
              </div>
            ))}

            {errors.techs && <span className='text-red-500'>{errors.techs.root?.message}</span>}  

          </div>


          <button className='bg-emerald-500 p-3 rounded text-white' type='submit'>Click Here</button>
        </form>

        <pre>
          {output}
        </pre>
    </main>
  )
}
