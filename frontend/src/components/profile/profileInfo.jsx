import { useRef } from "react";
import { FiCamera } from "react-icons/fi";
import Avatar from "../common/Avatar.jsx";
import SocialLinks from "./SocialLink.jsx";

const ProfileInfo = ({
  userProfile,
  isOwnProfile,
  uploading,
  onEditProfile,
  onImageChange,
}) => {
  const fileInputRef = useRef(null);

  const handleProfileImageClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-[350px] h-[500px] border border-gray-200 rounded-2xl shadow-md bg-white flex flex-col justify-center items-center space-y-6 p-8">
      {/* 프로필 이미지 */}
      <div className="relative">
        <Avatar user={userProfile} size="xlarge" />
        {isOwnProfile && (
          <button
            onClick={handleProfileImageClick}
            disabled={uploading}
            className="absolute bottom-0 right-0 btn-primary rounded-full p-3 shadow-lg disabled:opacity-50"
            aria-label="Upload profile image"
          >
            <FiCamera size={20} />
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
        />
      </div>

      {/* 프로필 정보 */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold">{userProfile?.username}</h2>
        <p className="font-semibold text-lg">{userProfile?.fullName}</p>
        <p className="text-md mt-2">{userProfile?.bio}</p>

        <div className="mt-4">
          <SocialLinks links={userProfile?.socialLinks} />
        </div>

        {isOwnProfile && (
          <button
            onClick={onEditProfile}
            className="mt-4 px-6 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;