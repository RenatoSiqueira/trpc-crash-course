import { useRouter } from "next/router";
import { type NextPage } from "next";
import Link from "next/link";

import { api } from "~/utils/api";
import { type ChangeEvent, useState, useEffect } from "react";

interface FormData {
  title: string,
  description: string,
}

const EditNote: NextPage = () => {
  const utils = api.useContext()
  const router = useRouter()
  const noteId = router.query.id as string
  const { data: note, isLoading } = api.notes.detailNote.useQuery({ id: noteId })

  const updateNote = api.notes.updateNote.useMutation({
    onMutate: async () => {
      await utils.notes.allNotes.cancel()
      const optmisticUpdate = utils.notes.allNotes.getData()
      if (optmisticUpdate) {
        // utils.notes.allNotes.setData(optmisticUpdate)
      }
    },
    onSettled: async () => {
      await utils.notes.allNotes.invalidate()
      await utils.notes.detailNote.invalidate()
    }
  })

  const [data, setData] = useState<FormData>({
    title: '',
    description: ''
  })

  useEffect(() => {
    if (isLoading || !note) return
    setData({
      title: note.title,
      description: note.description
    })
  }, [])

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

  if (isLoading) return <>Loading...</>

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        form to add new note
        <form onSubmit={(event) => {
          event.preventDefault()
          updateNote.mutate({
            id: noteId,
            title: data.title,
            description: data.description
          })
          setData({ title: '', description: '' })
        }}>
          <input
            type={'text'}
            required
            name={'title'}
            value={data?.title}
            placeholder='Your Title'
            onChange={(event) => handleTitleChange(event)}
          />
          <input
            type={'text'}
            required
            name={'description'}
            value={data?.description}
            placeholder='Your Descr'
            onChange={(event) => handleDescriptionChange(event)}
          />
          <button type="submit">Save</button>
        </form>
        <Link className="text-white" href={'/'}>Go Back</Link>
      </main>
    </>
  );
};

export default EditNote;
