import { type ChangeEvent, useState } from "react";
import { type NextPage } from "next";
import Link from "next/link";

import { api } from "~/utils/api";

interface FormData {
  title: string,
  description: string
}

const NewNote: NextPage = () => {
  const utils = api.useContext()
  const addNewNote = api.notes.newNote.useMutation({
    onMutate: async () => {
      await utils.notes.allNotes.cancel()
      const optimisticUpdate = utils.notes.allNotes.getData()
      console.log(optimisticUpdate)
      // if (optimisticUpdate) {
      //   utils.notes.allNotes.setData(newData, optimisticUpdate)
      // }
    },
    onSettled: async () => {
      await utils.notes.allNotes.invalidate()
    }
  })
  const [data, setData] = useState<FormData>({
    title: '',
    description: ''
  })

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      title: event.target.value
    })
  }
  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      description: event.target.value
    })
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        form to add new note
        <form onSubmit={(event) => {
          event.preventDefault()
          addNewNote.mutate(data)
        }}>
          <input
            type={'text'}
            required
            name={'title'}
            value={data.title}
            placeholder='Your Title'
            onChange={(event) => handleTitleChange(event)}
          />
          <input
            type={'text'}
            required
            name={'description'}
            value={data.description}
            placeholder='Your Descr'
            onChange={(event) => handleDescriptionChange(event)}
          />
          <button type="submit">Save</button>
        </form>
        <Link href={'/'}>Go Back</Link>
      </main>
    </>
  );
};

export default NewNote;
