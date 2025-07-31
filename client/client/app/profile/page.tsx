import ProfileForm from '@/components/ProfileForm';

export default function ProfilePage() {
    return (
        <div className="max-w-2xl mx-auto mt-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">My Profile</h1>
            <ProfileForm />
        </div>
    );
}
