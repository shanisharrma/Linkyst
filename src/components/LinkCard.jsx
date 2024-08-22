import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Copy, Delete, Download, Trash } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

const LinkCard = ({ url, fetchUrls }) => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const filename = url?.title;

    //   create an anchor tag
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = filename;

    // append the anchor tag to body
    document.body.appendChild(anchor);

    //   trigger the downloading by simulating the click event
    anchor.click();
    document.body.removeChild(anchor);
  };

  const {
    data,
    error,
    loading: loadingDelete,
    fn: fnDelete,
  } = useFetch(deleteUrl, url?.id);

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <img
        src={url?.qr}
        alt="qr code"
        className="h-32 object-contain ring ring-blue-400 self-start"
      />
      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1">
        <span className="text-3xl font-bold hover:underline cursor-pointer">
          {url?.title}
        </span>
        <span className="text-xl text-blue-400 font-medium hover:underline cursor-pointer">
          {import.meta.env.VITE_SITE_URL}/
          {url?.custom_url ? url?.custom_url : url?.short_url}
        </span>
        <span className="flex items-center gap-1 hover:underline cursor-pointer">
          {url?.original_url}
        </span>
        <span className="flex items-end font-light text-sm flex-1">
          {new Date(url?.custom_url).toLocaleDateString()}
        </span>
      </Link>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() =>
            navigator.clipboard.writeText(
              `${import.meta.env.VITE_SITE_URL}/${url?.short_url}`
            )
          }
        >
          <Copy />
        </Button>
        <Button variant="ghost" onClick={downloadImage}>
          <Download />
        </Button>
        <Button
          variant="ghost"
          onClick={() => fnDelete().then(() => fetchUrls())}
        >
          {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
