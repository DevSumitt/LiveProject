'use client';
import { useEffect, useState } from "react";
import style from "./page.module.css"
import { useRouter } from "next/navigation"; // 1. Router import karein
import Link from "next/link";

function Home() {
    const [showModal, setShowModal] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [stats, setStats] = useState({ total: 0, avail: 0 });
    const [toasts, setToasts] = useState([]);

    const router = useRouter(); // 2. Router initialize karein

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        const newToast = { id, message, type };
        setToasts((prev) => [...prev, newToast]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    };

    // User state
    const [user, setUser] = useState({
        name: 'Loading...',
        email: 'Please wait...'
    });

    // --- FORM STATE ADDED ---
    const [formData, setFormData] = useState({
        checkInDate: '',
        guest: 1,
    });



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };



    const getRooms = async () => {
        try {
            const response = await fetch('https://liveproject-1-ydol.onrender.com/api/get-rooms');
            const result = await response.json();
            if (result.data) {
                setRooms(result.data);
                const t = result.data.reduce((acc, r) => acc + r.totalInventory, 0);
                const a = result.data.reduce((acc, r) => acc + r.availableInventory, 0);
                setStats({ total: t, avail: a });
            }
        } catch (err) {
            console.error("Error fetching rooms:", err);
        }
    };

    const userInfo = async () => {
        const BASE_API = "https://liveproject-1-ydol.onrender.com/api";
        try {
            const response = await fetch(`${BASE_API}/get-customerinfo`, {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();

            if (result.loggedIn) {
                setUser({
                    name: result.data.Name || 'Guest User',
                    email: result.data.Email || 'guest@example.com'
                });
            } else {
                router.push("/");
            }
        } catch (err) {
            console.error("Error fetching user info:", err);
            setUser({ name: 'Guest User', email: 'Not logged in' });
        }
    }

    useEffect(() => {
        getRooms();
        userInfo();
    }, []);

    const openModal = (room) => {
        setSelectedRoom(room);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRoom(null);
    };

    // --- UPDATED BOOKING FUNCTION ---
    const booknow = async (e) => {
        e.preventDefault();

        const bookingDetails = {
            RoomName: selectedRoom.name,
            RoomType: selectedRoom.category,
            RoomPrice: selectedRoom.price,
            checkIn: formData.checkInDate,
            checkOut: formData.checkOutDate,
            guest: formData.guests,
            email: user.email,
            name: user.name
        };

        console.log(bookingDetails);

        try {
            const BASE_API = "https://liveproject-1-ydol.onrender.com/api";
            const response = await fetch(`${BASE_API}/book-now`, {
                method: "POST",
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(bookingDetails)
            });

            const result = await response.json();

            if (response.ok) {
                showToast(result.msg, "success");
                getRooms(); // Dashboard par inventory update karne ke liye
            } else {
                showToast(result.message || "Booking failed", "error");
            }

        } catch (err) {
            console.error("booking failed:", err);
            showToast("Server error, try again later", "error");
        } finally {
            closeModal();
        }
    };

    const logout = async () => {
        const BASE_API = "https://liveproject-1-ydol.onrender.com/api";
        try {
            const data = await fetch(`${BASE_API}/logout-customer`, {
                credentials: "include",
                method: "POST"
            });
            const result = await data.json();
            if (result.loggedOut) {
                showToast("Logout Successful", "success");
                setTimeout(() => router.push("/"), 1000);
            } else {
                showToast("Something went wrong", "error");
            }
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };
    return (
        <>

            <div className={style.toastContainer}>
                {toasts.map((toast) => (
                    <div key={toast.id} className={`${style.toast} ${style[toast.type]}`}>
                        {toast.message}
                    </div>
                ))}
            </div>

            <nav className={style.navbar}>
                <a href="#" className={style.logo}>SUMIT.</a>
                <ul className={style.ul}>
                    <li><a href="#rooms">Rooms</a></li>
                    <li><a href="#dining">Dining</a></li>
                    <li><a href="#amenities">Amenities</a></li>
                    <li><a href="#contact">Contact</a></li>
                    <Link href="/Booking">Check booking</Link>
                </ul>
                <div className={style.NamesDiv}>
                    <div className={style.userprofile}>
                        <div className={style.userdetails} style={{ textAlign: 'right' }}>
                            <div style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                            <div style={{ color: 'var(--text)', fontSize: '0.7rem', opacity: 0.6 }}>{user.email}</div>
                        </div>
                        <button className={style.navbtn} style={{ padding: '5px 15px', fontSize: '0.8rem', cursor: 'pointer' }} onClick={logout}>Logout</button>
                    </div>
                </div>
            </nav>
            <div className={style.mainwarapper} >
                <header style={{ marginTop: '100px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <h1>THE GRAND HOTELS</h1>
                    <p style={{ letterSpacing: "3px", opacity: "0.7" }}>A SYMPHONY OF LUXURY & STYLE</p>
                </header>
            </div>


            <div className={style.inventorybar} style={{ marginTop: "300px" }}>
                <div className={style.invitem}>
                    <h4 className={style.h4}>Total Rooms</h4>
                    <span className={style.number}>{stats.total}</span>
                </div>
                <div className={style.invitem}>
                    <h4 className={style.h4}>Available Now</h4>
                    <span className={style.number} id={style.avail}>{stats.avail}</span>
                </div>
                <div className={style.invitem}>
                    <h4 className={style.h4}> Booked (Today)</h4>
                    <span className={style.number} style={{ color: "var(--danger)" }}>3</span>
                </div>
            </div>
            <h2 id={style.rooms} className={style.sectiontitle}>Luxury Living</h2>
            <div className={style.grid} id={style.roomscontainer}>
                {rooms.length > 0 ? (
                    rooms.map((room, index) => {
                        const isLowStock = room.availableInventory <= 5;
                        const percentageLeft = (room.availableInventory / room.totalInventory) * 100;
                        return (
                            <div className={style.itemcard} key={index}>
                                <div className={style.cardheader}>
                                    <span className={style.categorybadge}>{room.category || 'Standard'}</span>

                                    <span className={`${style.availtag} ${isLowStock ? style.tagdanger : style.tagsuccess}`}>
                                        {isLowStock ? `Only ${room.availableInventory} Left!` : `${room.availableInventory} Available`}
                                    </span>
                                </div>
                                <h3 className={style.roomtitle} style={room.type === 'Royal Penthouse' ? { color: '#d4af37', fontWeight: 'bold' } : {}}>{room.name}</h3>
                                <p className={style.roomdesc}>{room.description}</p>
                                <div className={style.inventorysection}>
                                    <div className={style.inventorylabels}>
                                        <span>Inventory: <strong>{room.availableInventory}</strong> / {room.totalInventory}</span>
                                        <span>{Math.round(percentageLeft)}% free</span>
                                    </div>
                                    <div className={style.progressbarbg}>
                                        <div className={style.progressfill} style={{ width: `${percentageLeft}%` }}></div>
                                    </div>
                                </div>
                                <div className={style.cardfooter}>
                                    <div className={style.pricetag}>₹{room.price.toLocaleString('en-IN')}<span>/night</span></div>
                                    <button className={style.btnreserve} onClick={() => openModal(room)}>Choose Room</button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>Loading luxury rooms...</p>
                )}


                {showModal && selectedRoom && (
                    <div className={style.modal} style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)' }}>
                        <div className={style.modalcontent} style={{ backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '20px', width: '90%', maxWidth: '400px', border: '1px solid var(--gold)', color: 'white', textAlign: 'center', position: 'relative', marginRight: "380px" }}>
                            <span className={style.closemodal} onClick={closeModal} style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '28px', cursor: 'pointer', color: '#aaa' }}>&times;</span>
                            <h2 style={{ color: 'var(--gold)', marginBottom: '5px' }}>{selectedRoom.name}</h2>
                            <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '20px' }}>{selectedRoom.category}</p>

                            <div style={{ background: 'rgba(46, 213, 115, 0.1)', padding: '15px', borderRadius: '10px', marginBottom: '25px', border: '1px dashed #2ed573' }}>
                                <span style={{ fontSize: '0.8rem', display: 'block', color: '#aaa', textTransform: 'uppercase' }}>Price per night</span>
                                <div style={{ color: '#2ed573', fontWeight: 'bold', fontSize: '1.2rem' }}>₹{selectedRoom.price.toLocaleString('en-IN')}</div>
                            </div>

                            {/* --- FORM IMPLEMENTED --- */}
                            <form onSubmit={booknow} style={{ textAlign: 'left' }}>
                                <div className={style.formgroup} style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.65rem', color: 'var(--gold)' }}>Select Check-in Date</label>
                                    <input
                                        type="date"
                                        name="checkInDate"
                                        value={formData.checkInDate}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '12px', height: '45px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0a0a0a', color: 'white' }}
                                        required
                                    />
                                </div>
                                <div className={style.formgroup} style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.65rem', color: 'var(--gold)' }}>Select Check-out Date</label>
                                    <input
                                        type="date"
                                        name="checkOutDate"
                                        value={formData.checkOutDate}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '12px', height: '45px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0a0a0a', color: 'white' }}
                                        required
                                    />
                                </div>

                                <div className={style.formgroup} style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.65rem', color: 'var(--gold)' }}>Number of Guests</label>
                                    <input
                                        type="number"
                                        name="guests"
                                        max={5}
                                        min={1}
                                        value={formData.guests}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '12px', height: '45px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0a0a0a', color: 'white' }}
                                        required
                                    />
                                </div>

                                <button type="submit" className={style.btnconfirm} style={{ width: '100%', padding: '15px', background: 'var(--gold)', color: '#000', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
                                    Confirm Booking
                                </button>
                            </form>
                        </div>
                    </div>
                )}


            </div>


        </>
    )
}

export default Home;
