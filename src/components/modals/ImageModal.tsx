import { AiOutlineClose } from "react-icons/ai"

interface ModalProps {
    selectedImage : string
}

const ImageModal:React.FC<ModalProps> = ({selectedImage}) => {
  return (
<>
<dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
  <form method="dialog" className="modal-box">
    <button className="text-right float-right"><AiOutlineClose className="md:h-6 md:w-6 h-7 w-7 bg-zinc-500 text-white cursor-pointer rounded-full p-0.5"/></button>
    <h3 className="font-bold mt-4 text-lg text-center">Selected Image</h3>
    <div className="modal-action flex flex-col gap-3 items-center">
      <img src={selectedImage} className="h-72 w-8/12"/>
      {/* <button className="btn btn-sm rounded-sm w-8/12">Close</button> */}
    </div>
  </form>
</dialog>
</>
  )
}

export default ImageModal