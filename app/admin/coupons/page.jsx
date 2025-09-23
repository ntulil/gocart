// 'use client'
// import { useEffect, useState } from "react"
// import { format } from "date-fns"
// import toast from "react-hot-toast"
// import { DeleteIcon } from "lucide-react"
// import { useAuth } from "@clerk/nextjs"
// import axios from "axios"

// export default function AdminCoupons() {

//     const { getToken } = useAuth()

//     const [coupons, setCoupons] = useState([])

//     const [newCoupon, setNewCoupon] = useState({
//         code: '',
//         description: '',
//         discount: '',
//         forNewUser: false,
//         forMember: false,
//         isPublic: false,
//         expiresAt: new Date()
//     })

//     const fetchCoupons = async () => {
//         try {
//             const token = await getToken()
//             const { data } = await axios.get('/api/admin/coupon', { headers: {
//                 Authorization: `Bearer ${token}`
//             }})
//             setCoupons(data.coupons)
//         } catch (error) {
//             toast.error(error?.response?.data?.error || error.message)
//         }
//     }

//     const handleAddCoupon = async (e) => {
//         e.preventDefault()
//         // Logic to add a coupon
//         try {
//             const token = await getToken()
//             newCoupon.discount = Number(newCoupon.discount)
//             newCoupon.expiresAt = new Date(newCoupon.expiresAt)

//             const { data } = await axios.post('/api/admin/coupon', { coupon: 
//                 newCoupon }, { headers: {
//                 Authorization: `Bearer ${token}`
//             }})
//             toast.success(data.message)
//             await fetchCoupons()
            
//         } catch (error) {
//             toast.error(error?.response?.data?.error || error.message)

//         }
//     }

//     const handleChange = (e) => {
//         setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value })
//     }

//     const deleteCoupon = async (code) => {
//         // Logic to delete a coupon
//         try {
//             const confirm = window.confirm("Are you sure you want to delete this coupon?")

//             if (!confirm) return;

//             const token = await getToken()
//             await axios.delete(`/api/admin/coupon?code=${code}`, { headers: {
//                 Authorization: `Bearer ${token}`}})
//                 await fetchCoupons()
//                 toast.success("Coupon deleted successfully")

//         } catch (error) {
//             toast.error(error?.response?.data?.error || error.message)
//         }


//     }

//     useEffect(() => {
//         fetchCoupons();
//     }, [])

//     return (
//         <div className="text-slate-500 mb-40">

//             {/* Add Coupon */}
//             <form onSubmit={(e) => toast.promise(handleAddCoupon(e), { loading: "Adding coupon..." })} className="max-w-sm text-sm">
//                 <h2 className="text-2xl">Add <span className="text-slate-800 font-medium">Coupons</span></h2>
//                 <div className="flex gap-2 max-sm:flex-col mt-2">
//                     <input type="text" placeholder="Coupon Code" className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
//                         name="code" value={newCoupon.code} onChange={handleChange} required
//                     />
//                     <input type="number" placeholder="Coupon Discount (%)" min={1} max={100} className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
//                         name="discount" value={newCoupon.discount} onChange={handleChange} required
//                     />
//                 </div>
//                 <input type="text" placeholder="Coupon Description" className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
//                     name="description" value={newCoupon.description} onChange={handleChange} required
//                 />

//                 <label>
//                     <p className="mt-3">Coupon Expiry Date</p>
//                     <input type="date" placeholder="Coupon Expires At" className="w-full mt-1 p-2 border border-slate-200 outline-slate-400 rounded-md"
//                         name="expiresAt" value={format(newCoupon.expiresAt, 'yyyy-MM-dd')} onChange={handleChange}
//                     />
//                 </label>

//                 <div className="mt-5">
//                     <div className="flex gap-2 mt-3">
//                         <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
//                             <input type="checkbox" className="sr-only peer"
//                                 name="forNewUser" checked={newCoupon.forNewUser}
//                                 onChange={(e) => setNewCoupon({ ...newCoupon, forNewUser: e.target.checked })}
//                             />
//                             <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
//                             <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
//                         </label>
//                         <p>For New User</p>
//                     </div>
//                     <div className="flex gap-2 mt-3">
//                         <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
//                             <input type="checkbox" className="sr-only peer"
//                                 name="forMember" checked={newCoupon.forMember}
//                                 onChange={(e) => setNewCoupon({ ...newCoupon, forMember: e.target.checked })}
//                             />
//                             <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
//                             <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
//                         </label>
//                         <p>For Member</p>
//                     </div>
//                 </div>
//                 <button className="mt-4 p-2 px-10 rounded bg-slate-700 text-white active:scale-95 transition">Add Coupon</button>
//             </form>

//             {/* List Coupons */}
//             <div className="mt-14">
//                 <h2 className="text-2xl">List <span className="text-slate-800 font-medium">Coupons</span></h2>
//                 <div className="overflow-x-auto mt-4 rounded-lg border border-slate-200 max-w-4xl">
//                     <table className="min-w-full bg-white text-sm">
//                         <thead className="bg-slate-50">
//                             <tr>
//                                 <th className="py-3 px-4 text-left font-semibold text-slate-600">Code</th>
//                                 <th className="py-3 px-4 text-left font-semibold text-slate-600">Description</th>
//                                 <th className="py-3 px-4 text-left font-semibold text-slate-600">Discount</th>
//                                 <th className="py-3 px-4 text-left font-semibold text-slate-600">Expires At</th>
//                                 <th className="py-3 px-4 text-left font-semibold text-slate-600">New User</th>
//                                 <th className="py-3 px-4 text-left font-semibold text-slate-600">For Member</th>
//                                 <th className="py-3 px-4 text-left font-semibold text-slate-600">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-200">
//                             {coupons.map((coupon) => (
//                                 <tr key={coupon.code} className="hover:bg-slate-50">
//                                     <td className="py-3 px-4 font-medium text-slate-800">{coupon.code}</td>
//                                     <td className="py-3 px-4 text-slate-800">{coupon.description}</td>
//                                     <td className="py-3 px-4 text-slate-800">{coupon.discount}%</td>
//                                     <td className="py-3 px-4 text-slate-800">{format(coupon.expiresAt, 'yyyy-MM-dd')}</td>
//                                     <td className="py-3 px-4 text-slate-800">{coupon.forNewUser ? 'Yes' : 'No'}</td>
//                                     <td className="py-3 px-4 text-slate-800">{coupon.forMember ? 'Yes' : 'No'}</td>
//                                     <td className="py-3 px-4 text-slate-800">
//                                         <DeleteIcon onClick={() => toast.promise(deleteCoupon(coupon.code), { loading: "Deleting coupon..." })} className="w-5 h-5 text-red-500 hover:text-red-800 cursor-pointer" />
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     )
// } 


'use client'
import { useEffect, useState } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { DeleteIcon, Loader2 } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function AdminCoupons() {
    const { getToken, isLoaded, isSignedIn } = useAuth()
    const router = useRouter()
    const [coupons, setCoupons] = useState([])
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)

    const [newCoupon, setNewCoupon] = useState({
        code: '',
        description: '',
        discount: '',
        forNewUser: false,
        forMember: false,
        isPublic: false,
        expiresAt: format(new Date(), 'yyyy-MM-dd')
    })

    const fetchCoupons = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/coupon', { 
                headers: { Authorization: `Bearer ${token}` }
            })
            setCoupons(data.coupons || [])
        } catch (error) {
            console.error('Failed to fetch coupons:', error)
            toast.error(error?.response?.data?.error || 'Failed to load coupons')
        } finally {
            setLoading(false)
        }
    }

    const handleAddCoupon = async (e) => {
        e.preventDefault()
        setAdding(true)
        try {
            const token = await getToken()
            const couponData = {
                ...newCoupon,
                discount: Number(newCoupon.discount),
                expiresAt: new Date(newCoupon.expiresAt)
            }

            const { data } = await axios.post('/api/admin/coupon', 
                { coupon: couponData }, 
                { headers: { Authorization: `Bearer ${token}` } }
            )
            toast.success(data.message || 'Coupon added successfully')
            await fetchCoupons()
            // Reset form
            setNewCoupon({
                code: '',
                description: '',
                discount: '',
                forNewUser: false,
                forMember: false,
                isPublic: false,
                expiresAt: format(new Date(), 'yyyy-MM-dd')
            })
        } catch (error) {
            console.error('Failed to add coupon:', error)
            toast.error(error?.response?.data?.error || 'Failed to add coupon')
        } finally {
            setAdding(false)
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setNewCoupon(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const deleteCoupon = async (code) => {
        try {
            const confirm = window.confirm("Are you sure you want to delete this coupon?")
            if (!confirm) return;

            const token = await getToken()
            await axios.delete(`/api/admin/coupon?code=${code}`, { 
                headers: { Authorization: `Bearer ${token}` }
            })
            await fetchCoupons()
            toast.success("Coupon deleted successfully")
        } catch (error) {
            console.error('Failed to delete coupon:', error)
            toast.error(error?.response?.data?.error || 'Failed to delete coupon')
        }
    }

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchCoupons()
        } else if (isLoaded && !isSignedIn) {
            router.push('/sign-in')
        }
    }, [isLoaded, isSignedIn])

    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
            </div>
        )
    }

    if (!isSignedIn) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-slate-700">Redirecting to login...</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Coupon Management</h1>
            
            {/* Add Coupon */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">Add New Coupon</h2>
                <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Coupon Code *</label>
                        <input 
                            type="text" 
                            placeholder="SUMMER25" 
                            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            name="code" 
                            value={newCoupon.code} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Discount (%) *</label>
                        <input 
                            type="number" 
                            placeholder="15" 
                            min={1} 
                            max={100} 
                            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            name="discount" 
                            value={newCoupon.discount} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Description *</label>
                        <input 
                            type="text" 
                            placeholder="Summer sale discount" 
                            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            name="description" 
                            value={newCoupon.description} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Expiry Date *</label>
                        <input 
                            type="date" 
                            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            name="expiresAt" 
                            value={newCoupon.expiresAt} 
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="flex flex-col justify-end space-y-3">
                        <label className="flex items-center space-x-2">
                            <input 
                                type="checkbox" 
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                name="forNewUser" 
                                checked={newCoupon.forNewUser}
                                onChange={handleChange}
                            />
                            <span className="text-sm text-slate-600">For New Users Only</span>
                        </label>
                        
                        <label className="flex items-center space-x-2">
                            <input 
                                type="checkbox" 
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                name="forMember" 
                                checked={newCoupon.forMember}
                                onChange={handleChange}
                            />
                            <span className="text-sm text-slate-600">For Members Only</span>
                        </label>
                    </div>
                    
                    <div className="md:col-span-2 flex justify-end mt-4">
                        <button 
                            type="submit"
                            disabled={adding}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
                        >
                            {adding ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Adding...
                                </>
                            ) : 'Add Coupon'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List Coupons */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">Existing Coupons</h2>
                
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
                    </div>
                ) : coupons.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No coupons found. Add your first coupon above.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Code</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Discount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Expires</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">New User</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Member</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {coupons.map((coupon) => (
                                    <tr key={coupon.code} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-900">{coupon.code}</td>
                                        <td className="px-4 py-3 text-slate-600">{coupon.description}</td>
                                        <td className="px-4 py-3 text-slate-600">{coupon.discount}%</td>
                                        <td className="px-4 py-3 text-slate-600">{format(new Date(coupon.expiresAt), 'MMM dd, yyyy')}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${coupon.forNewUser ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                                {coupon.forNewUser ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${coupon.forMember ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                                {coupon.forMember ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button 
                                                onClick={() => deleteCoupon(coupon.code)}
                                                className="text-red-500 hover:text-red-700 transition-colors focus:outline-none"
                                                title="Delete coupon"
                                            >
                                                <DeleteIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}