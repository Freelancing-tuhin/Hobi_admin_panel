import UserProfileApp from 'src/components/apps/userprofile/profile';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Business Profile',
  },
];
const UserProfile = () => {
  return (
    <>
      <BreadcrumbComp title="Business Profile" items={BCrumb} />
      <UserProfileApp />
    </>
  );
};

export default UserProfile;
