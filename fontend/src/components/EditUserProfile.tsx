import { checkUser, updateUserProfile } from "@/utils/ApiFunction";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

const EditUserProfile = () => {
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: checkUser,
    retry: false,
  });

  // Add at the top:
  const [profilePic, setProfilePic] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (userData?.author) {
      setProfilePic(userData.author.profilePic || "");
      setName(userData.author.name || "");
      setBio(userData.author.bio || "");
      setWebsite(userData.author.website || "");
      setSocialLinks(
        userData.author.socialLinks || {
          facebook: "",
          twitter: "",
          instagram: "",
        }
      );
    }
  }, [userData]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const uploadEditForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("website", website);
    formData.append("socialLinks", JSON.stringify(socialLinks));
    if (selectedFile) {
      formData.append("profilePic", selectedFile);
    }
    try {
      setFormLoading(true);
      const response = await updateUserProfile(formData);
      if (response.message) toast.success(response.message);
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setFormLoading(false);
    }
  };
  return (
    <div>
      <div className="">
        <form
          onSubmit={uploadEditForm}
          className="flex  items-center justify-center flex-col gap-2 w-full"
        >
          <img
            src={profilePic}
            alt="user Profile pic"
            className="size-24 rounded-full"
          />
          <input
            type="file"
            accept="image/*"
            className="bg-Primary-text-color/15 rounded-2xl p-2"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setProfilePic(URL.createObjectURL(file)); // For preview
                setSelectedFile(file); // Save file for upload
              }
            }}
          />
          {/* name */}
          <div className="flex flex-col gap-0 justify-center items-start">
            <label htmlFor="name" className="font-semibold capitalize">
              Name{" "}
            </label>
            <input
              id="name"
              required
              type="text"
              className="bg-Primary-text-color/15 px-4 py-2 rounded-2xl outline-none 
              focus:border-1 border-Primary-text-color "
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
            />
          </div>
          {/* bio */}
          <div className="flex flex-col gap-0 justify-center items-start">
            <label htmlFor="bio" className="font-semibold capitalize">
              Bio{" "}
            </label>

            <textarea
              id="bio"
              className="bg-Primary-text-color/15 px-4 py-2 rounded-2xl outline-none 
              focus:border-1 border-Primary-text-color min-h-24 resize-none "
              value={bio}
              placeholder="bio"
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div></div>
          {/* website */}
          <div className="flex flex-col justify-center items-start gap-0">
            <label htmlFor="website" className="font-semibold capitalize">
              Website{" "}
            </label>
            <input
              type="text"
              className="bg-Primary-text-color/15 px-4 py-2 rounded-2xl outline-none 
              focus:border-1 border-Primary-text-color "
              value={website}
              placeholder="website"
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          {/* social links */}
          {/* facebook */}
          <div className="flex flex-col justify-center items-start gap-0">
            <label htmlFor="facebook" className="font-semibold capitalize">
              Facebook{" "}
            </label>

            <input
              type="text"
              id="facebook"
              className="bg-Primary-text-color/15 px-4 py-2 rounded-2xl outline-none 
              focus:border-1 border-Primary-text-color "
              value={socialLinks.facebook}
              placeholder="facebook"
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, facebook: e.target.value })
              }
            />
          </div>
          {/* twitter */}
          <div className="flex flex-col justify-center items-start gap-0">
            <label htmlFor="twitter" className="font-semibold capitalize">
              twitter{" "}
            </label>

            <input
              id="twitter"
              type="text"
              className="bg-Primary-text-color/15 px-4 py-2 rounded-2xl outline-none 
              focus:border-1 border-Primary-text-color "
              value={socialLinks.twitter}
              placeholder="twitter"
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, twitter: e.target.value })
              }
            />
          </div>
          {/* instagram */}
          <div className="flex flex-col justify-center items-start gap-0">
            <label htmlFor="instagram" className="font-semibold capitalize">
              instagram
            </label>

            <input
              id="instagram"
              type="text"
              className="bg-Primary-text-color/15 px-4 py-2 rounded-2xl outline-none 
              focus:border-1 border-Primary-text-color "
              value={socialLinks.instagram}
              placeholder="instagram"
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, instagram: e.target.value })
              }
            />
          </div>

          <Button disabled={formLoading} type="submit">
            {formLoading ? "updating..." : "submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditUserProfile;
