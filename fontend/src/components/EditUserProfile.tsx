import { checkUser } from "@/utils/ApiFunction";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const EditUserProfile = () => {
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: checkUser,
    retry: false,
  });

  const [profilePic, setProfilePic] = useState(userData.author.profilePic);
  const [name, setName] = useState(userData.author.name);
  const [bio, setBio] = useState(userData.author.bio);
  const [website, setWebsite] = useState(userData.author.website);
  const [socialLinks, setSocialLinks] = useState(userData.author.socialLinks);

  const uploadEditForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <div>
      <div className="bg-red-50 w-screen">
        <form
          onSubmit={uploadEditForm}
          className="flex items-center justify-center flex-col gap-2 w-full"
        >
          <img
            src={profilePic}
            alt="user Profile pic"
            className="size-24 rounded-full"
          />
          {/* name */}
          <input
            type="text"
            className="bg-Primary-background-color "
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {/* bio */}
          <input
            type="text"
            className="bg-Primary-background-color "
            value={bio}
            placeholder="bio"
            onChange={(e) => setBio(e.target.value)}
          />
          {/* website */}
          <input
            type="text"
            className="bg-Primary-background-color "
            value={website}
            placeholder="website"
            onChange={(e) => setWebsite(e.target.value)}
          />
          {/* social links */}
          <input
            type="text"
            className="bg-Primary-background-color "
            value={socialLinks.facebook}
            placeholder="website"
            onChange={(e) => setSocialLinks(e.target.value)}
          />
          <input
            type="text"
            className="bg-Primary-background-color "
            value={socialLinks.twitter}
            placeholder="website"
            onChange={(e) => setSocialLinks(e.target.value)}
          />
          <input
            type="text"
            className="bg-Primary-background-color w-4/5 "
            value={socialLinks.instagram}
            placeholder="website"
            onChange={(e) => setSocialLinks(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default EditUserProfile;
