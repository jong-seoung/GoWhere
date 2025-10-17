import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUserStore from "../store/userStore";
import useAuthStore from "../store/authStore";
import userService from "../services/user";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileInfo from "../components/profile/ProfileInfo";
import EditProfileModal from "../components/profile/EditProfileModal";

const Profile = () => {
  const { userId } = useParams();
  const { userProfile, getUserProfile } = useUserStore();
  const { user: currentUser, setAuth } = useAuthStore();

  const [uploading, setUploading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const isOwnProfile = currentUser?.id === userProfile?.id;

  const handleFollow = async () => {
    try {
      if (!userProfile) return;
      await toggleFollow(userProfile.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must not exceed 5MB");
      return;
    }

    try {
      setUploading(true);
      const result = await userService.uploadProfileImage(file);

      const updatedUser = {
        ...currentUser,
        profileImageUrl: result.url,
      };

      setAuth({
        user: updatedUser,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      localStorage.setItem("user", JSON.stringify(updatedUser));
      await getUserProfile(userId);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        await getUserProfile(userId);
      } catch (err) {
        console.error(err);
      }
    };
    loadUserProfile();
  }, [getUserProfile, userId]);

  return (
    <div className="bg-gray-50">
      <div className="bg-white min-h-screen max-w-2xl mx-auto flex flex-col">
        <ProfileHeader username={userProfile?.username} />

        <ProfileInfo
          userProfile={userProfile}
          isOwnProfile={isOwnProfile}
          uploading={uploading}
          onEditProfile={() => setShowEditModal(true)}
          onFollow={handleFollow}
          onImageChange={handleFileChange}
        />

      </div>

      {showEditModal && (
        <EditProfileModal
          onClose={() => {
            setShowEditModal(false);
            getUserProfile(userId);
          }}
          currentProfile={userProfile}
        />
      )}
    </div>
  );
};

export default Profile;