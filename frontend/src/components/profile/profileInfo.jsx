import { useRef } from "react";
import { FiCamera } from "react-icons/fi";
import Avatar from "../common/Avatar";
import SocialLinks from "../profile/SocialLink.jsx";

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
    <div className="p-4 border-divider">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <Avatar user={userProfile} size="large" />
          {isOwnProfile && (
            <button
              onClick={handleProfileImageClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 btn-primary rounded-full p-2 shadow-lg disabled:opacity-50"
              aria-label="Upload profile image"
            >
              <FiCamera size={16} />
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

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">{userProfile?.username}</h2>
            {isOwnProfile ? (
              <button
                onClick={onEditProfile}
                className="px-4 py-1 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
              >
                Edit Profile
              </button>
            ) : (
              <div></div>
            )}
          </div>

          <p className="font-semibold text-sm">{userProfile?.fullName}</p>
          <p className="text-sm mt-1">{userProfile?.bio}</p>
          <SocialLinks links={userProfile?.socialLinks} />
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
