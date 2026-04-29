import React, { useState, useEffect } from 'react';
import { Plus, Download, Filter, Trash2, Edit2, Search, Loader2 } from 'lucide-react';
import AddReadingModal from '../components/AddReadingModal';
import { cn } from '../lib/utils';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useAuthStore } from '../store';

export default function Records() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'records'),
      where('userId', '==', user.id),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecords(docs);
      setLoading(false);
    }, (error) => {
      console.error("Failed to fetch records", error);
      handleFirestoreError(error, OperationType.LIST, 'records');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleExport = () => {
    alert("Exporting health data as CSV... PulseGuard AI is preparing your secure package.");
  };

  const handleEdit = (id: string) => {
    alert(`Initializing secure edit for record #${id}. PulseGuard AI is preparing your data environment.`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this health record? This action cannot be undone by PulseGuard AI.")) {
      try {
        await deleteDoc(doc(db, 'records', id));
        alert("Record securely purged from PulseGuard Cloud.");
      } catch (error) {
        console.error("Delete failed", error);
        handleFirestoreError(error, OperationType.DELETE, `records/${id}`);
      }
    }
  };

  const formatTimestamp = (ts: any) => {
    if (!ts) return 'Pending...';
    const date = ts.toDate();
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
           ' • ' + 
           date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredRecords = records.filter(r => 
    r.notes.toLowerCase().includes(search.toLowerCase()) || 
    r.date.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Health Records</h2>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Record
          </button>
        </div>
      </div>

      <AddReadingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes or dates..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => alert("Opening advanced filters... Sort by Systolic, Diastolic, or Pulse consistency.")}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all active:scale-90"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date & Time</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Reading</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Pulse</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Notes</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold italic">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Synchronizing with PulseGuard Cloud...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold italic">
                    No records found in this environment.
                  </td>
                </tr>
              ) : filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 tracking-tight">{formatTimestamp(record.timestamp)}</td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-black text-slate-900">{record.sys}/{record.dia}</span>
                    <span className="ml-1 text-[10px] text-slate-400 font-bold uppercase tracking-wide">mmHg</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">{record.pulse} bpm</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      record.status === 'Normal' ? "bg-emerald-50 text-emerald-600" : 
                      record.status === 'Elevated' ? "bg-amber-50 text-amber-600" :
                      record.status === 'Hypertension I' ? "bg-orange-50 text-orange-600" :
                      record.status === 'Hypertension II' ? "bg-rose-50 text-rose-600" : 
                      "bg-red-50 text-red-600"
                    )}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">{record.notes}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 transition-opacity duration-200">
                      <button 
                        onClick={() => handleEdit(record.id)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 active:scale-90"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(record.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 active:scale-90"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
          <span>Showing {filteredRecords.length} of {records.length} records</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-100 rounded-lg opacity-50 cursor-not-allowed">Prev</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
