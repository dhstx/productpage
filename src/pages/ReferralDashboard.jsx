import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingState from '../components/LoadingState';
import { 
  Users, Gift, DollarSign, TrendingUp, Copy, 
  Check, Share2, Trophy, Zap, Star 
} from 'lucide-react';

export default function ReferralDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [stats, setStats] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      setLoading(true);
      
      // Load referral code
      const codeResponse = await fetch('/api/referrals/code', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const codeData = await codeResponse.json();
      setReferralCode(codeData.code);

      // Load stats
      const statsResponse = await fetch('/api/referrals/stats', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Load referrals list
      const referralsResponse = await fetch('/api/referrals', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const referralsData = await referralsResponse.json();
      setReferrals(referralsData);

      // Load tiers
      const tiersResponse = await fetch('/api/referrals/tiers');
      const tiersData = await tiersResponse.json();
      setTiers(tiersData);
    } catch (error) {
      console.error('Failed to load referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/register?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = 'Join me on dhstx.co!';
    const body = `I'm using dhstx.co for AI-powered automation and I think you'd love it too!\n\nUse my referral code ${referralCode} to get 1 month free when you sign up:\n${window.location.origin}/register?ref=${referralCode}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const shareViaTwitter = () => {
    const text = `Check out @dhstx - AI-powered automation platform! Use my code ${referralCode} for 1 month free`;
    const url = `${window.location.origin}/register?ref=${referralCode}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const getTierIcon = (tierName) => {
    switch (tierName) {
      case 'Bronze': return <Star className="w-5 h-5 text-orange-600" />;
      case 'Silver': return <Star className="w-5 h-5 text-gray-400" />;
      case 'Gold': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'Platinum': return <Trophy className="w-5 h-5 text-purple-600" />;
      default: return <Star className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return <LoadingState message="Loading referral dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
          <p className="mt-2 text-gray-600">
            Earn rewards by inviting friends to dhstx.co
          </p>
        </div>

        {/* Referral Link Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Your Referral Link</h2>
          </div>
          
          <p className="mb-6 text-indigo-100">
            Share your unique link and earn 150 PT for each friend who subscribes!
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between gap-4">
              <code className="text-lg font-mono flex-1 truncate">
                {window.location.origin}/register?ref={referralCode}
              </code>
              <button
                onClick={copyReferralLink}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={shareViaEmail}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Share via Email
            </button>
            <button
              onClick={shareViaTwitter}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Share on Twitter
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-indigo-600" />
                <span className="text-2xl font-bold text-gray-900">
                  {stats.total_referrals}
                </span>
              </div>
              <p className="text-sm text-gray-600">Total Referrals</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">
                  {stats.completed_referrals}
                </span>
              </div>
              <p className="text-sm text-gray-600">Completed</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-8 h-8 text-yellow-600" />
                <span className="text-2xl font-bold text-gray-900">
                  {stats.total_rewards_pt}
                </span>
              </div>
              <p className="text-sm text-gray-600">PT Earned</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                {getTierIcon(stats.current_tier)}
                <span className="text-2xl font-bold text-gray-900">
                  {stats.current_tier}
                </span>
              </div>
              <p className="text-sm text-gray-600">Current Tier</p>
            </div>
          </div>
        )}

        {/* Tier Progress */}
        {stats && stats.next_tier && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Progress to {stats.next_tier.name} Tier
            </h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-indigo-600">
                    {stats.completed_referrals} / {stats.next_tier.min_referrals} referrals
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-indigo-600">
                    {Math.round((stats.completed_referrals / stats.next_tier.min_referrals) * 100)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                <div
                  style={{ width: `${(stats.completed_referrals / stats.next_tier.min_referrals) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {stats.next_tier.referrals_needed} more referrals to unlock {stats.next_tier.name} tier benefits!
            </p>
          </div>
        )}

        {/* Referral Tiers */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Referral Tiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`p-4 rounded-lg border-2 ${
                  stats && stats.current_tier === tier.name
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getTierIcon(tier.name)}
                  <h4 className="font-semibold text-gray-900">{tier.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {tier.min_referrals}+ referrals
                </p>
                <p className="text-sm font-medium text-indigo-600">
                  {tier.commission_percentage}% commission
                </p>
                {tier.bonus_pt > 0 && (
                  <p className="text-sm text-gray-600">
                    +{tier.bonus_pt} PT bonus
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Referrals List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Your Referrals</h3>
          </div>
          
          {referrals.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No referrals yet
              </h3>
              <p className="text-gray-600">
                Start sharing your referral link to earn rewards!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reward
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {referrals.map((referral) => (
                    <tr key={referral.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {referral.referred_email || 'User'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          referral.status === 'rewarded' ? 'bg-green-100 text-green-800' :
                          referral.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          referral.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {referral.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {referral.referrer_reward_amount ? (
                          <span className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-yellow-600" />
                            {referral.referrer_reward_amount} PT
                          </span>
                        ) : (
                          <span className="text-gray-400">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

