'use client';

import React, { useEffect, useState } from 'react';
import style from "./page.module.css";
import Link from 'next/link';
import { useRouter } from "next/navigation"; // 1. Router import karein


function Home() {
    const [bookings, setBookings] = useState([]);
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

    const Booknfo = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/getBooking-info');
            const result = await response.json();
            setBookings(result.data || result);
        } catch (err) {
            console.error("Error fetching Booking:", err);
        }
    };

    const deleteBooking = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/deleteBooking/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (result.msg == "Booking deleted successfully") {
                showToast(result.msg, "success");
                Booknfo();

            } else {
                showToast(result.msg, "error");

            }
        } catch (err) {
            console.error("Error deleting:", err);
        }
    };
    const userInfo = async () => {
        const BASE_API = "http://localhost:5000/api";
        try {
            const response = await fetch(`${BASE_API}/get-customerinfo`, {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            if (result.loggedIn) {
                console.log("user Logged In ")
            } else {
                router.push("/");
            }
        } catch (err) {
            console.error("Error fetching user info:", err);
            setUser({ name: 'Guest User', email: 'Not logged in' });
        }
    }


    useEffect(() => {
        Booknfo();
        userInfo();
    }, []);

    return (
        <>
            <div className={style.container}>
                <div className={style.toastContainer}>
                    {toasts.map((toast) => (
                        <div key={toast.id} className={`${style.toast} ${style[toast.type]}`}>
                            {toast.message}
                        </div>
                    ))}
                </div>
            </div>
            <div className={style.container}>
                <header className={style.header}>
                    <h1 className={style.h1}>Booking Management</h1>
                    <p className={style.p}>Premium Guest Services </p>

                </header>

                <div className={style.tablecontainer}>
                    <table className={style.table}>
                        <thead className={style.thead}>
                            <tr className={style.tr}>
                                <th className={style.th}>Name</th>
                                <th className={style.th}>Email</th>
                                <th className={style.th}>Room Details</th>
                                <th className={style.th}>Type</th>
                                <th className={style.th}>CheckIn</th>
                                <th className={style.th}>CheckOut</th>
                                <th className={style.th}>Prices</th>
                                <th className={style.th}>Guest</th>
                                <th className={style.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody id={style.bookinglist}>
                            {/* 3. Map through the bookings state */}
                            {bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <tr key={booking._id}>
                                        <td className={style.td}>{booking.fullname}</td>
                                        <td className={style.td}>{booking.email}</td>
                                        <td className={style.td}>{booking.RoomName}</td>
                                        <td className={style.td}>{booking.type}</td>
                                        <td className={style.td}>{booking.checkin || 'N/A'}</td>
                                        <td className={style.td}>{booking.checkout || 'N/A'}</td>
                                        <td className={style.td}>₹{booking.totalAmount || '0'}</td>
                                        <td className={style.td}>{booking.guest || '1'}</td>
                                        <td className={style.td}>
                                            <button
                                                className={style.deletebtn}
                                                onClick={() => deleteBooking(booking._id)}
                                                style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className={style.td}>
                                    <td colSpan="9" style={{ textAlign: 'center' }}>No Bookings Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>


                </div>
                <p className={style.back}><Link href="/Dashboard">Go Back</Link>
                </p>
            </div>

        </>
    );
}

export default Home;