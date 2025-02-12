import {
  GetAvatarsDocument,
  MeDocument,
  UpdateProfileImageDocument,
} from "~/generated/generated";
import { useMutation, useQuery } from "@apollo/client";
import Image from "next/image";


import { Dialog, Transition } from "@headlessui/react";
import React, { type FC, Fragment } from "react";
import { IoClose } from "react-icons/io5";

type Props = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};

const AvatarModal: React.FunctionComponent<Props> = ({
  showModal,
  setShowModal,
}) => {
  const [updateAvatarMutation] = useMutation(UpdateProfileImageDocument, {
    refetchQueries: [{ query: MeDocument }],
  });

  const data = useQuery(GetAvatarsDocument) || [];
  let avatarList: {
    id: string;
    name: string;
    url: string;
  }[] = [];
  if (data.loading === false && data.data !== undefined) {
    console.log(data.data.getAvatars);
    avatarList = data.data.getAvatars
    // avatarList = JSON.parse(data.data?.getAvatars);
  }

  return (
    <Modal
      showModal={showModal}
      onClose={() => setShowModal(false)}
      title={"Choose your avatar"}
      size="md"
    >
      <div className="w-full h-full flex justify-center">
        <div className="max-h-[40vh] w-full grid md:grid-cols-2 grid-cols-1 m-4 bg-white/10 backdrop-filter backdrop-blur-lg bg-clip-padding rounded-lg p-2 items-center justify-center gap-2 overflow-y-scroll">
          {avatarList.map((avatar, index) => (
            <div
              className="rounded-xl border border-primary-200/30 items-center justify-center flex h-full p-2 hover:bg-primary-200/20 transition-colors duration-300"
              key={index}
              onClick={async() => {
                await updateAvatarMutation({
                  variables: {
                    imageURL: avatar.url,
                  },
                });
                setShowModal(false);
              }}
            >
              <Image
                src={avatar.url}
                alt={avatar.name}
                className="h-[100px] cursor-pointer"
                width={100}
                height={100}
              />
              {/* <div className="text-center">{avatar.name}</div> */}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default AvatarModal;

type ModalProps = {
  children: React.ReactNode;
  title: string;
  /**
   * size = 'small' is suited for confirmation modals with just a title and footer buttons. Caps width at 20rem
   */
  size?: "small" | "medium" | "md";
  onClose: () => void;
  showModal: boolean;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
};

const Modal: FC<ModalProps> = ({
  children,
  title,
  size,
  onClose,
  showModal,
  rounded = "2xl",
}) => {
  return (
    <Transition appear show={showModal} as={Fragment}>
      <Dialog as="div" className="relative z-[900]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div
          className={`fixed inset-0 z-10 p-4 md:p-8 overflow-y-auto ${
            size === "small" && "md:w-80 w-64 mx-auto"
          } ${size === "md" && `md:w-[30rem] w-[16rem] mx-auto `}`}
        >
          <div className="flex min-h-full items-center justify-center text-center py-5 md:py-7">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full max-w-6xl transform overflow-hidden rounded-${rounded} bg-primary-300/70 text-gray-100 backdrop-blur-xl text-left align-middle shadow-xl transition-all`}
              >
                <Dialog.Title
                  as="div"
                  className={`flex justify-between items-center md:p-6 p-5 ${
                    size === "small" && "md:pb-2"
                  }`}
                >
                  <h3
                    className={`bodyFont text-lg font-medium leading-6 text-white ${
                      size === "small" && "text-center"
                    }`}
                  >
                    {title}
                  </h3>
                  {/* {size !== "small" && ( */}
                  <button
                    className="hover:text-white text-gray-400 transition-colors cursor-pointer z-[50000]"
                    onClick={onClose}
                  >
                    <IoClose size="1.4rem" />
                  </button>
                  {/* )} */}
                </Dialog.Title>
                {size !== "small" && <hr className="opacity-30" />}
                <div>{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};