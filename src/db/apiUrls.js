import supabase, { supabaseUrl } from "./supabase";

export const getUrls = async (user_id) => {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);
  if (error) {
    console.error(error.message);
    throw new Error("Unable to load data.");
  }
  return data;
};

export const deleteUrl = async (id) => {
  const { data, error } = await supabase.from("urls").delete().eq("id", id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to delete url");
  }

  return data;
};

export const createUrl = async (
  { title, longUrl, customUrl, user_id },
  qr_code
) => {
  const short_url = Math.random().toString(36).substring(2, 8);
  const filename = `qr-${short_url}`;

  const { error: storageError } = await supabase.storage
    .from("qr_codes")
    .upload(filename, qr_code);

  const qr = `${supabaseUrl}/storage/v1/object/public/qr_codes/${filename}`;

  if (storageError) throw new Error(storageError.message);

  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        title,
        original_url: longUrl,
        custom_url: customUrl,
        user_id,
        short_url,
        qr,
      },
    ])
    .select();

  if (error) {
    console.error(error.message);
    throw new Error("Error while creating short URL");
  }

  return data;
};

export const getLongUrl = async (id) => {
  let { data: shortLinkData, error: shortLinkError } = await supabase
    .from("urls") // Specifies the table to query
    .select("id, original_url") // Specifies the columns to retrieve
    .or(`short_url.eq.${id},custom_url.eq.${id}`) // OR condition to match either short_url or custom_url with the value of id
    .single(); // Ensures only a single record is returned

  if (shortLinkError && shortLinkError.code !== "PGRST116") {
    console.error("Error fetching short link:", shortLinkError);
    return;
  }

  return shortLinkData;
};

export const getUrl = async ({ id, user_id }) => {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error(error.message);
    throw new Error("Short URL not found!");
  }

  return data;
};
