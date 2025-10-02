'use client'
import { assets } from "@/assets/assets"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"

export default function StoreAddProduct() {

    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Health', 'Toys & Games', 'Sports & Outdoors', 'Books & Media', 'Food & Drink', 'Hobbies & Crafts', 'Others']

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
    })
    const [loading, setLoading] = useState(false)

    const { getToken } = useAuth()


    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        // Logic to add a product, ie submit form
        try {
            // if no images are uploaded then return
            if(!images[1] && !images[2] && !images[3] && !images[4]){
                return toast.error('Please upload at least one image')
            }
            setLoading(true)

            const formData = new FormData ()
            formData.append('name', productInfo.name)
            formData.append('description', productInfo.description)
            formData.append('mrp', productInfo.mrp)
            formData.append('price', productInfo.price)
            formData.append('category', productInfo.category)

            // Adding Images to FormData
            Object.keys(images).forEach((key)=>{
                images[key] && formData.append('images', images[key])
            })
            const token = await getToken()
            const { data } = await axios.post('/api/store/product', formData, {
                headers: { Authorization: `Bearer ${token}`}
            })
            toast.success(data.message)

            // Reset form
            setProductInfo({
                name: "",
                description: "",
                mrp: 0,
                price: 0,
                category: "",
            })

            // Reset images
            setImages({ 1: null, 2: null, 3: null, 4: null })

        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        finally {
            setLoading(false)
        }
        
    }


    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })} className="text-slate-500 mb-28">
            <h1 className="text-2xl">Add New <span className="text-slate-800 font-medium">Products</span></h1>
            <p className="mt-7">Product Images</p>

            <div htmlFor="" className="flex gap-3 mt-4">
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`images${key}`}>
                        <Image width={300} height={300} className='h-15 w-auto border border-slate-200 rounded cursor-pointer' src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area} alt="" />
                        <input type="file" accept='image/*' id={`images${key}`} onChange={e => setImages({ ...images, [key]: e.target.files[0] })} hidden />
                    </label>
                ))}
            </div>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Name
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Enter product name" className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" required />
            </label>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Description
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Enter product description" rows={5} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
            </label>

            <div className="flex gap-5">
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Actual Price ($)
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" rows={5} className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
                </label>
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Offer Price ($)
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0" rows={5} className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
                </label>
            </div>

            <select onChange={e => setProductInfo({ ...productInfo, category: e.target.value })} value={productInfo.category} className="w-full max-w-sm p-2 px-4 my-6 outline-none border border-slate-200 rounded" required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>

            <br />

            <button disabled={loading} className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition">Add Product</button>
        </form>
    )
}
/*
'use client'
import { useEffect, useState } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { DeleteIcon } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function AdminCoupons() {
    const { getToken, isLoaded, isSignedIn, userId } = useAuth()
    const router = useRouter()
    const [coupons, setCoupons] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    const [newCoupon, setNewCoupon] = useState({
        code: '',
        description: '',
        discount: '',
        forNewUser: false,
        forMember: false,
        isPublic: false,
        expiresAt: new Date()
    })

    // Check if user is admin
    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!isLoaded) return;
            
            if (!isSignedIn) {
                router.push('/sign-in');
                return;
            }
            
            try {
                const token = await getToken()
                const { data } = await axios.get('/api/admin/check-access', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                
                if (data.isAdmin) {
                    setIsAdmin(true)
                    fetchCoupons()
                } else {
                    router.push('/unauthorized')
                }
            } catch (error) {
                console.error('Admin check failed:', error)
                router.push('/unauthorized')
            } finally {
                setLoading(false)
            }
        }
        
        checkAdminStatus()
    }, [isLoaded, isSignedIn, getToken, router])

    const fetchCoupons = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/coupon', { 
                headers: { Authorization: `Bearer ${token}` }
            })
            setCoupons(data.coupons)
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    const handleAddCoupon = async (e) => {
        e.preventDefault()
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
            toast.success(data.message)
            await fetchCoupons()
            // Reset form
            setNewCoupon({
                code: '',
                description: '',
                discount: '',
                forNewUser: false,
                forMember: false,
                isPublic: false,
                expiresAt: new Date()
            })
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    const handleChange = (e) => {
        setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value })
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
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    if (!isLoaded || loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-700"></div>
        </div>
    }

    if (!isAdmin) {
        return <div className="flex justify-center items-center h-64">
            <p className="text-slate-700">You are not authorized to access this page.</p>
        </div>
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Coupon Management</h1>
            
            //  Add Coupon 
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">Add New Coupon</h2>
                <form onSubmit={(e) => toast.promise(handleAddCoupon(e), { loading: "Adding coupon..." })} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Coupon Code</label>
                        <input 
                            type="text" 
                            placeholder="SUMMER25" 
                            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                            name="code" 
                            value={newCoupon.code} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Discount (%)</label>
                        <input 
                            type="number" 
                            placeholder="15" 
                            min={1} 
                            max={100} 
                            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                            name="discount" 
                            value={newCoupon.discount} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                        <input 
                            type="text" 
                            placeholder="Summer sale discount" 
                            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                            name="description" 
                            value={newCoupon.description} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Expiry Date</label>
                        <input 
                            type="date" 
                            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                            name="expiresAt" 
                            value={format(newCoupon.expiresAt, 'yyyy-MM-dd')} 
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="flex flex-col justify-end space-y-3">
                        <label className="flex items-center space-x-2">
                            <input 
                                type="checkbox" 
                                className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                                name="forNewUser" 
                                checked={newCoupon.forNewUser}
                                onChange={(e) => setNewCoupon({ ...newCoupon, forNewUser: e.target.checked })}
                            />
                            <span className="text-sm text-slate-600">For New Users Only</span>
                        </label>
                        
                        <label className="flex items-center space-x-2">
                            <input 
                                type="checkbox" 
                                className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                                name="forMember" 
                                checked={newCoupon.forMember}
                                onChange={(e) => setNewCoupon({ ...newCoupon, forMember: e.target.checked })}
                            />
                            <span className="text-sm text-slate-600">For Members Only</span>
                        </label>
                    </div>
                    
                    <div className="md:col-span-2 flex justify-end mt-4">
                        <button className="px-6 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                            Add Coupon
                        </button>
                    </div>
                </form>
            </div>

            //  List Coupons 
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">Existing Coupons</h2>
                
                {coupons.length === 0 ? (
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
                                                onClick={() => toast.promise(deleteCoupon(coupon.code), { loading: "Deleting coupon..." })}
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
} */