import DeviceStats from "@/components/DeviceStats";
import LocationStats from "@/components/LocationStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlState } from "@/context";
import { getStatsForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";

const Link = () => {
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
  const { id } = useParams();
  const { user } = UrlState();
  const navigate = useNavigate();

  const {
    loading,
    error,
    data: url,
    fn,
  } = useFetch(getUrl, { id, user_id: user?.id });

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getStatsForUrl, id);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
    fnStats();
  }, []);

  if (error) {
    console.log(error.message);
    navigate("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url?.short_url;
  }

  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
      <div className="flex flex-col gap-8 sm:flex-row justify-between">
        <div className="flex flex-col items-start rounded-lg gap-8 sm:w-2/5">
          <span className="text-3xl sm:text-4xl font-extrabold hover:underline cursor-pointer">
            {url?.title}
          </span>
          <a
            href={`${import.meta.env.VITE_SITE_URL}/${link}`}
            target="_blank"
            className="text-xl sm:text-2xl text-blue-400 font-extrabold hover:underline cursor-pointer"
          >
            {import.meta.env.VITE_SITE_URL}/{link}
          </a>
          <a
            href={url?.original_url}
            target="_blank"
            className="flex items center gap-1 hover:underline cursor-pointer"
          >
            <LinkIcon className="p-1" />
            {url?.original_url}
          </a>
          <span className="flex items-end font-light text-sm">
            {new Date(url?.created_at).toLocaleDateString()}
          </span>

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
            <Button variant="ghost" onClick={() => fnDelete()}>
              {loadingDelete ? (
                <BeatLoader size={5} color="white" />
              ) : (
                <Trash />
              )}
            </Button>
          </div>
          <img
            src={url?.qr}
            alt="qr code"
            className="w-full self-centre sm:self-start object-contain ring ring-blue-400 p-1"
          />
        </div>

        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-extrabold">
              Stats
            </CardTitle>
          </CardHeader>
          {stats && stats?.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{stats?.length}</p>
                </CardContent>
              </Card>

              <CardTitle>Location Data</CardTitle>
              <LocationStats stats={stats} />
              <CardTitle>Device Info</CardTitle>
              <DeviceStats stats={stats} />
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? "No Statistics Found Yet."
                : "Loading sTatistics..."}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default Link;
