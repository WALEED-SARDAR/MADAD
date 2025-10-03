import React from 'react'
import { createCheckoutSession } from '../../api/donation';
import { toast } from "react-hot-toast"

const DonationForm = ({ campaignId, minimumAmount = 200 }) => {

    const [processing, setProcessing] = React.useState(false);
    const [amount, setAmount] = React.useState(minimumAmount);

    const handleDonation = async (formData) => {
        formData.preventDefault();

        if (processing) return;
        if (amount < minimumAmount) {
            alert(`Minimum donation amount is ${minimumAmount} PKR`);
            return;
        }
        try {
            setProcessing(true);
            const response = await createCheckoutSession({ amount: Number(amount), campaignId });
            if (!response || !response.url) {
                toast.error("Failed to create Stripe checkout session.");
                setProcessing(false);
                return;
            }
            window.location.href = response.url;
        } catch (error) {
            toast.error(error.message || "Failed in creating checkout session");
            setProcessing(false);
        }
    }

    return (
        <div>
            <h2 className='text-lg font-bold text-gray-800 mb-2'>Make a Donation</h2>
            <form onSubmit={handleDonation}>
                <label htmlFor="amount" className='block text-sm font-medium text-gray-700 mb-1'>
                    Amount (PKR)
                </label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    min={minimumAmount}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Minimum amount is ${minimumAmount} PKR`}
                    required
                    className='block w-full border border-gray-300 rounded-md p-2 mb-4'
                />
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-blue-800">Secure Payment</span>
                    </div>
                    <p className="text-sm text-blue-700">
                        You will be redirected to Stripe's secure checkout page to complete your payment with credit/debit card.
                    </p>
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    {processing ? 'Redirecting to Stripe...' : 'Donate Now'}
                </button>
                <p className="text-gray-500 text-xs mt-2 text-center">
                    Secure payment powered by Stripe
                </p>
            </form>
        </div>
    )
}

export default DonationForm
