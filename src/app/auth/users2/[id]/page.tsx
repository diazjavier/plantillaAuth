interface Props {
  params: Promise<{ id: string }>;
}

async function EditUser({params}: Props) {
  const { id } = await params;

  return (
    <div>
      Edit User {id}
    </div>
  )
};

export default EditUser;
