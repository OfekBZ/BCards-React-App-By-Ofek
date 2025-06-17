import { Footer } from "flowbite-react";
import { IoIosInformationCircle } from "react-icons/io";

function MyFooter() {
  return (
    <Footer className="mt-5 border-t-4 border-sky-500 bg-sky-500 shadow-xl dark:bg-sky-700" container>
      <div className="flex w-full flex-col items-center text-center">
        <div className="flex flex-col items-center">
          <IoIosInformationCircle size={32} className="mb-1" />
          <Footer.Copyright href="/about" by="About" />
        </div>
      </div>
    </Footer>
  );
}

export default MyFooter;
