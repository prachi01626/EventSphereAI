import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { paymentService } from '../services/paymentService';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  CreditCard,
  X,
  CheckCircle2,
  Calendar,
  MapPin,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export const EventRegistrationModal = () => {
  const {
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    selectedEventForModal,
    setActiveTab,
  } = useEvents();

  const { user, openAuthModal } = useAuth();

  const [customAnswers, setCustomAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(null);

  if (!isRegisterModalOpen || !selectedEventForModal) return null;

  const event = selectedEventForModal;

  const handleCustomFieldChange = (fieldName, value) => {
    setCustomAnswers((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handlePaymentAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const orderData = await paymentService.createOrder(event._id, customAnswers);

      if (orderData.free) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setRegisteredSuccess(orderData.registrationId);
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.key_id || 'rzp_test_EventSphere2026',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'EventSphere AI',
        description: `Pass for ${event.title}`,
        order_id: orderData.order_id,
        prefill: {
          name: user?.name || orderData.participantName || '',
          email: user?.email || orderData.participantEmail || '',
        },
        theme: {
          color: '#2d5a43',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (response) => {
          try {
            const verifyRes = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registrationId: orderData.registrationId,
            });

            if (verifyRes.success) {
              confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
              setRegisteredSuccess(orderData.registrationId);
            } else {
              setErrorMessage('Payment verification failed');
            }
          } catch (vErr) {
            setErrorMessage(vErr.response?.data?.message || 'Verification error');
          } finally {
            setLoading(false);
          }
        },
      };

      if (typeof window.Razorpay === 'function') {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (failResp) {
          setErrorMessage(`Payment Failed: ${failResp.error?.description || 'Declined'}`);
          setLoading(false);
        });
        rzp.open();
      } else {
        const verifyRes = await paymentService.verifyPayment({
          razorpay_order_id: orderData.order_id,
          razorpay_payment_id: `pay_sim_${Date.now()}`,
          razorpay_signature: 'simulated_signature',
          registrationId: orderData.registrationId,
        });

        if (verifyRes.success) {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          setRegisteredSuccess(orderData.registrationId);
        }
        setLoading(false);
      }
    } catch (err) {
      console.error('Registration/Payment error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to initiate checkout');
      setLoading(false);
    }
  };

  const handleCloseAndGoToPasses = () => {
    setIsRegisterModalOpen(false);
    setRegisteredSuccess(null);
    setActiveTab('participant');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white/95 p-6 md:p-8 shadow-2xl border border-white my-8 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-900/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Event Registration</h2>
              <p className="text-xs text-slate-500">Complete details & generate Dynamic TOTP Pass</p>
            </div>
          </div>
          <button
            onClick={() => setIsRegisterModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-2xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {registeredSuccess ? (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-700 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Registration Successful!</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your 30-Second Dynamic Anti-Proxy Pass has been issued and linked to your attendee account.
            </p>
            <div className="pt-4">
              <button
                onClick={handleCloseAndGoToPasses}
                className="w-full py-3.5 px-6 forest-pill-active rounded-2xl font-bold text-sm shadow-pill"
              >
                View My Dynamic Pass Now →
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePaymentAndRegister} className="mt-5 space-y-4">
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/50 space-y-2">
              <h3 className="text-base font-bold text-slate-900">{event.title}</h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  {formatDate(event.date)}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  {event.venue}
                </span>
              </div>
              <div className="pt-2 flex items-center justify-between border-t border-emerald-200/60 text-xs">
                <span className="text-slate-600 font-semibold">Ticket Admission:</span>
                <span className="text-sm font-extrabold text-emerald-800">
                  {formatCurrency(event.ticketPrice)}
                </span>
              </div>
            </div>

            {!user ? (
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2.5">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>Attendee Sign-In Required</span>
                </div>
                <p className="text-slate-600">
                  Please sign in or create an account to register and link this 30s Dynamic Pass to your identity.
                </p>
                <button
                  type="button"
                  onClick={() => openAuthModal('login', 'Participant')}
                  className="w-full py-2.5 px-4 forest-pill-active rounded-xl font-bold text-xs shadow-xs"
                >
                  Sign In / Register to Continue →
                </button>
              </div>
            ) : (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <p>
                  <strong className="text-slate-900">Attendee:</strong> {user.name}
                </p>
                <p>
                  <strong className="text-slate-900">Email:</strong> {user.email}
                </p>
              </div>
            )}

            {event.customFormFields && event.customFormFields.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Attendee Questionnaire
                </h4>
                {event.customFormFields.map((field, idx) => (
                  <div key={idx} className="space-y-1">
                    <label className="block text-xs text-slate-700 font-semibold">
                      {field.fieldName} {field.required && <span className="text-rose-500">*</span>}
                    </label>

                    {field.fieldType === 'select' ? (
                      <select
                        required={field.required}
                        value={customAnswers[field.fieldName] || ''}
                        onChange={(e) => handleCustomFieldChange(field.fieldName, e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 shadow-xs"
                      >
                        <option value="">Select an option...</option>
                        {field.options?.map((opt, oIdx) => (
                          <option key={oIdx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.fieldType === 'number' ? 'number' : 'text'}
                        required={field.required}
                        value={customAnswers[field.fieldName] || ''}
                        onChange={(e) => handleCustomFieldChange(field.fieldName, e.target.value)}
                        placeholder={`Enter ${field.fieldName.toLowerCase()}`}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 shadow-xs"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading || !user}
                className="w-full py-3.5 px-6 forest-pill-active rounded-2xl font-bold text-sm shadow-pill flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                    Connecting to Payment Gateway...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    {event.ticketPrice === 0
                      ? 'Claim Free VIP Pass'
                      : `Proceed to Pay ${formatCurrency(event.ticketPrice)}`}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
