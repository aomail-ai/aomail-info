import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-indigo max-w-none">
            <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>

            <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="mb-6">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>

            <h2 className="text-xl font-semibold mb-4">3. Information Sharing</h2>
            <p className="mb-6">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
            </p>

            <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
            <p className="mb-6">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>

            <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
            <p>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}