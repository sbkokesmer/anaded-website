import { FaCreditCard, FaCheckCircle, FaExclamationCircle, FaUniversity } from "react-icons/fa";
import Modal from "../ui/Modal";

export default function DuesModal({ open, onClose, profile }) {
  const dueDate = profile?.next_dues_date ? new Date(profile.next_dues_date) : null;
  const paid = profile?.dues_paid;
  const overdue = dueDate && !paid && new Date() >= dueDate;

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy mb-6 flex items-center gap-2 pr-8">
          <FaCreditCard className="text-brand-red" />
          Aidat Ödeme
        </h2>

        {/* Durum */}
        <div
          className={`rounded-xl p-4 mb-5 flex items-center gap-3 ${
            paid
              ? "bg-green-50 text-green-700"
              : overdue
              ? "bg-red-50 text-brand-red"
              : "bg-gold-light text-yellow-800"
          }`}
        >
          {paid ? <FaCheckCircle className="text-xl" /> : <FaExclamationCircle className="text-xl" />}
          <div>
            <p className="font-semibold text-sm">
              {paid ? "Aidatınız güncel" : overdue ? "Aidat ödemeniz gerekiyor" : "Aidat ödeme bekleniyor"}
            </p>
            {dueDate && (
              <p className="text-xs mt-0.5">
                Son ödeme tarihi: {dueDate.toLocaleDateString("tr-TR")}
              </p>
            )}
          </div>
        </div>

        {/* Ödeme bilgileri */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-semibold text-navy text-sm mb-3 flex items-center gap-2">
            <FaUniversity className="text-sky" /> Banka ile Ödeme
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              Aidatınızı aşağıdaki hesaba havale/EFT ile ödeyebilirsiniz. Açıklama kısmına
              <strong> üye numaranızı</strong> ({profile?.member_id || "—"}) yazmayı unutmayınız.
            </p>
            <div className="bg-white rounded-lg p-3 border border-gray-100 mt-2">
              <p className="text-xs text-gray-400">Banka / IBAN</p>
              <p className="font-mono text-navy text-sm">Ziraat Bankası</p>
              <p className="font-mono text-navy text-sm">TR00 0000 0000 0000 0000 0000 00</p>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Ödemenizi yaptıktan sonra dernek merkezimizi bilgilendirebilirsiniz. Ödemeniz
              onaylandığında durumunuz güncellenecektir.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
