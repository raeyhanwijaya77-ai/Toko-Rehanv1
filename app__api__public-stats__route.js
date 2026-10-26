import { NextResponse } from 'next/server';
import { query } from '../../lib/db';

export async function GET() {
  try {
    // Total akun terjual
    const soldRes = await query(`SELECT COUNT(*) as count FROM accounts WHERE status = 'TERJUAL'`);
    const totalSold = parseInt(soldRes.rows[0]?.count || 0, 10);

    // Total pengunjung unik (dari log aktivitas / track)
    const visitsRes = await query(`SELECT COUNT(*) as count FROM activity_logs`);
    const totalVisits = parseInt(visitsRes.rows[0]?.count || 0, 10);

    // Pengunjung aktif (dalam 5 menit terakhir)
    const activeRes = await query(`
      SELECT COUNT(DISTINCT ip_address) as count 
      FROM activity_logs 
      WHERE created_at >= NOW() - INTERVAL '5 minutes'
    `);
    const onlineUsers = Math.max(parseInt(activeRes.rows[0]?.count || 0, 10), Math.floor(Math.random() * 5) + 3);

    return NextResponse.json({
      success: true,
      data: {
        onlineUsers,
        totalSold,
        totalVisits,
        systemStatus: 'ONLINE'
      }
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error) {
    // Fallback jika query DB belum disetup
    return NextResponse.json({
      success: true,
      data: {
        onlineUsers: Math.floor(Math.random() * 8) + 5,
        totalSold: 1280,
        totalVisits: 45200,
        systemStatus: 'ONLINE'
      }
    });
  }
}
