import ProfileForm from '@/components/ProfileForm';

export default function ProfilePage() {
    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6">Môj profil</h1>
            <ProfileForm />
        </div>
    );
}
