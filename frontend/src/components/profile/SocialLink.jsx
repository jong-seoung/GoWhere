import { FaInstagram, FaFacebook, FaTwitter, FaTiktok } from "react-icons/fa";

const NaverIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="#03C75A"
  >
    <path d="M4 4h5.5l4.5 6.5V4H20v16h-5.5l-4.5-6.5V20H4V4z" />
  </svg>
);

const socialIcons = {
  INSTAGRAM: { icon: FaInstagram, color: "#E4405F" },
  FACEBOOK: { icon: FaFacebook, color: "#1877F2" },
  TWITTER: { icon: FaTwitter, color: "#1DA1F2" },
  TIKTOK: { icon: FaTiktok, color: "#000000" },
  NAVER_BLOG: { icon: NaverIcon, color: "#03C75A" },
};

export default function SocialLinks({ links }) {
  return (
    <div className="flex space-x-4">
      {links?.map((link) => {
        const IconData = socialIcons[link.socialType];
        if (!IconData) return null;

        const Icon = IconData.icon;
        const color = IconData.color;

        return (
          <a
            key={link.socialType}
            href={
              link.url
                ? link.url.startsWith("http")
                  ? link.url
                  : `https://${link.url}`
                : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 hover:opacity-80 transition"
          >
            <Icon size={24} color={color} />
          </a>
        );
      })}
    </div>
  );
}
