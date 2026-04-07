import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Router/api';

const Modal = ({ title, onClose, children }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-box" onClick={e=>e.stopPropagation()}>
      <div className="modal-header">
        <h2>{title}</h2>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const Profile = () => {
  const { userid } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [selAddr, setSelAddr] = useState(null);
  const [addrForm, setAddrForm] = useState({ flatNo:'', street:'', city:'', state:'', zipCode:'' });
  const [passForm, setPassForm] = useState({ newPassword:'' });
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const fetchProfile = useCallback(() => {
    api.get(`/ecom/customers/${userid}`)
      .then(res => setProfile(res.data))
      .catch(() => showToast('Failed to load profile','error'))
      .finally(() => setLoading(false));
  }, [userid]);

  useEffect(() => { document.title='ShopEase | Profile'; fetchProfile(); }, [fetchProfile]);

  const openAddAddr = () => { setAddrForm({flatNo:'',street:'',city:'',state:'',zipCode:''}); setModal('add'); };
  const openUpdateAddr = (addr) => {
    setSelAddr(addr);
    setAddrForm({ flatNo:addr.flatNo||'', street:addr.Street||addr.street||'', city:addr.city||'', state:addr.state||'', zipCode:addr.ZipCode||addr.zipCode||'' });
    setModal('update');
  };

  const submitAddr = async (e, mode) => {
    e.preventDefault(); setSaving(true);
    const payload = { flatNo:addrForm.flatNo, Street:addrForm.street, city:addrForm.city, state:addrForm.state, ZipCode:addrForm.zipCode };
    try {
      if (mode === 'add') await api.post(`/ecom/customer-addresses/${userid}`, payload);
      else await api.put(`/ecom/customer-addresses/update/${selAddr.addressID}`, payload);
      showToast(mode==='add'?'Address added!':'Address updated!');
      setModal(null); fetchProfile();
    } catch(err) { showToast(err.response?.data?.message||'Error','error'); }
    finally { setSaving(false); }
  };

  const changePass = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.put(`/ecom/customers/update-password/${userid}`, passForm);
      showToast('Password updated!'); setModal(null); setPassForm({newPassword:''});
    } catch(err) { showToast(err.response?.data?.message||'Error','error'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"/>Loading...</div>;
  if (!profile) return <div className="alert-error" style={{margin:20}}>Failed to load profile.</div>;

  const latestAddr = profile.address?.length ? profile.address[profile.address.length-1] : null;

  const AddrFields = () => (
    <>
      {[['flatNo','Flat No / Building'],['street','Street'],['city','City (max 50 chars)'],['state','State (max 50 chars)'],['zipCode','Zip Code']].map(([k,l]) => (
        <div className="modal-field" key={k}>
          <label>{l}</label>
          <input value={addrForm[k]} onChange={e=>setAddrForm({...addrForm,[k]:e.target.value})} required maxLength={k==='city'||k==='state'?50:undefined} />
        </div>
      ))}
    </>
  );

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <div className="profile-grid">
        <div className="profile-card">
          <h2>Personal Details</h2>
          <div className="profile-row"><span className="label">Status</span><span className="chip-ACTIVE">{profile.userAccountStatus}</span></div>
          <div className="profile-row"><span className="label">Full Name</span><span className="value">{profile.firstName} {profile.lastName}</span></div>
          <div className="profile-row"><span className="label">Email</span><span className="value">{profile.email}</span></div>
          <div className="profile-row"><span className="label">Phone</span><span className="value">{profile.phoneNumber}</span></div>
          <div className="profile-row"><span className="label">Registered</span><span className="value">{profile.registerTime?.substring(0,10)}</span></div>
          <div className="profile-actions">
            <button className="btn-profile outline" onClick={()=>setModal('pass')}>Change Password</button>
          </div>
        </div>

        <div className="profile-card">
          <h2>Address</h2>
          {latestAddr ? (
            <>
              <div className="profile-row"><span className="label">Building</span><span className="value">{latestAddr.flatNo}</span></div>
              <div className="profile-row"><span className="label">Street</span><span className="value">{latestAddr.Street||latestAddr.street}</span></div>
              <div className="profile-row"><span className="label">City</span><span className="value">{latestAddr.city}</span></div>
              <div className="profile-row"><span className="label">State</span><span className="value">{latestAddr.state}</span></div>
              <div className="profile-row"><span className="label">Zip Code</span><span className="value">{latestAddr.ZipCode||latestAddr.zipCode}</span></div>
              <div className="profile-actions">
                <button className="btn-profile primary" onClick={()=>openUpdateAddr(latestAddr)}>Update Address</button>
                <button className="btn-profile outline" onClick={openAddAddr}>Add New</button>
              </div>
            </>
          ) : (
            <>
              <p style={{color:'#888',marginBottom:16}}>No address saved yet.</p>
              <button className="btn-profile primary" onClick={openAddAddr}>+ Add Address</button>
            </>
          )}
        </div>
      </div>

      {modal === 'add' && <Modal title="Add Address" onClose={()=>setModal(null)}><form onSubmit={e=>submitAddr(e,'add')}><AddrFields /><button type="submit" className="btn-modal-submit" disabled={saving}>{saving?'Saving...':'Save Address'}</button></form></Modal>}
      {modal === 'update' && <Modal title="Update Address" onClose={()=>setModal(null)}><form onSubmit={e=>submitAddr(e,'update')}><AddrFields /><button type="submit" className="btn-modal-submit" disabled={saving}>{saving?'Saving...':'Update Address'}</button></form></Modal>}
      {modal === 'pass' && (
        <Modal title="Change Password" onClose={()=>setModal(null)}>
          <form onSubmit={changePass}>
            <div className="modal-field">
              <label>New Password</label>
              <input type="password" value={passForm.newPassword} minLength={5} maxLength={10} onChange={e=>setPassForm({newPassword:e.target.value})} required />
              <p className="modal-hint">Must be 5–10 characters</p>
            </div>
            <button type="submit" className="btn-modal-submit" disabled={saving}>{saving?'Updating...':'Update Password'}</button>
          </form>
        </Modal>
      )}
      {toast && <div className={`toast-notification toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
};
export default Profile;
