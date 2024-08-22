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
  const { data, error } = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (error) {
    console.error(error.message);
    throw new Error("Error while fetching short URL");
  }

  return data;
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
