import { getWalletData } from '../../actions/admin';

export const dynamic = 'force-dynamic';

export default async function WalletDashboard() {
  const { transactions, balance } = await getWalletData();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase italic">
            Revenue <span className="text-gold">Wallet</span>
          </h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">Financial overview & Transaction history</p>
        </div>
        
        <div className="bg-white/5 border border-gold/30 p-8 rounded-3xl backdrop-blur-xl relative overflow-hidden min-w-[300px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <p className="text-xs font-black text-gold uppercase tracking-[0.2em] mb-2 relative z-10">Total Balance</p>
          <h2 className="text-5xl font-black text-white relative z-10 italic">₹{balance.toLocaleString()}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl">
            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-6">Quick Stats</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-xs">Total Transactions</span>
                <span className="text-white font-bold">{transactions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-xs">Average Order</span>
                <span className="text-white font-bold">
                  ₹{transactions.length > 0 ? Math.round(balance / transactions.length).toLocaleString() : 0}
                </span>
              </div>
              <div className="h-px bg-white/5"></div>
              <div className="pt-2">
                <p className="text-[10px] text-gray-600 leading-relaxed">
                  All online payments are automatically credited here. Manual payments must be recorded separately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Column */}
        <div className="lg:col-span-2">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
              <h3 className="text-white text-sm font-black uppercase tracking-widest italic">Recent Activity</h3>
              <span className="text-[10px] bg-gold/10 text-gold px-3 py-1 rounded-full font-bold uppercase tracking-tighter border border-gold/20">Live Sync</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-gray-500">
                    <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black">Date</th>
                    <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black">Customer / Service</th>
                    <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black">Type</th>
                    <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((tx: any) => (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-6">
                        <p className="text-white font-bold text-sm">
                          {new Date(tx.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </p>
                        <p className="text-[10px] text-gray-600 uppercase tracking-tighter">
                          {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="p-6">
                        <p className="text-white font-bold text-sm group-hover:text-gold transition-colors">
                          {tx.bookings?.customer_name || 'Guest'}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                          {tx.bookings?.service_name || 'Direct Transaction'}
                        </p>
                      </td>
                      <td className="p-6">
                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                          tx.type === 'credit' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <p className={`text-lg font-black italic ${tx.type === 'credit' ? 'text-white' : 'text-red-400'}`}>
                          {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                        </p>
                      </td>
                    </tr>
                  ))}
                  
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-20 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-xs tracking-widest uppercase">No transactions recorded yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
