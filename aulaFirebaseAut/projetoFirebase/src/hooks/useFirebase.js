// Versão corrigida do useFirebase.js
import { useState } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, getDoc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../services/credenciaisFirebase';

const useFirebase = () => {
  const [loading, setLoading] = useState(false);

  // Funções existentes mantidas com a coleção "pessoa"
  const addUser = async (data) => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'pessoa'), data);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, 'pessoa'));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, 'pessoa', id));
  };

  const getUserById = async (id) => {
    const document = await getDoc(doc(db, 'pessoa', id));
    return { id: document.id, ...document.data() };
  };

  // Novas funções para gerenciamento de usuários usando a coleção "pessoa"
  const updateUser = async (id, data) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'pessoa', id), data);
    } finally {
      setLoading(false);
    }
  };

  const assignCourseToUser = async (userId, courseId) => {
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'pessoa', userId));
      const userData = userDoc.data();
      const cursos = userData.cursos || [];
      
      if (!cursos.includes(courseId)) {
        await updateDoc(doc(db, 'pessoa', userId), {
          cursos: [...cursos, courseId]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const removeCourseFromUser = async (userId, courseId) => {
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'pessoa', userId));
      const userData = userDoc.data();
      const cursos = userData.cursos || [];
      
      await updateDoc(doc(db, 'pessoa', userId), {
        cursos: cursos.filter(id => id !== courseId)
      });
    } finally {
      setLoading(false);
    }
  };

  const assignPeriodToUser = async (userId, periodId) => {
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'pessoa', userId));
      const userData = userDoc.data();
      const periodos = userData.periodos || [];
      
      if (!periodos.includes(periodId)) {
        await updateDoc(doc(db, 'pessoa', userId), {
          periodos: [...periodos, periodId]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const removePeriodFromUser = async (userId, periodId) => {
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'pessoa', userId));
      const userData = userDoc.data();
      const periodos = userData.periodos || [];
      
      await updateDoc(doc(db, 'pessoa', userId), {
        periodos: periodos.filter(id => id !== periodId)
      });
    } finally {
      setLoading(false);
    }
  };

  const changeUserStatus = async (userId, newStatus) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'pessoa', userId), {
        status: newStatus
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersByRole = async (role) => {
    const q = query(collection(db, 'pessoa'), where("role", "==", role));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // Funções para cursos e períodos (para referência)
  const fetchCursos = async () => {
    const snapshot = await getDocs(collection(db, 'cursos'));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const fetchPeriodos = async () => {
    const snapshot = await getDocs(collection(db, 'periodos'));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  return { 
    addUser, 
    fetchUsers, 
    deleteUser, 
    getUserById, 
    updateUser,
    assignCourseToUser,
    removeCourseFromUser,
    assignPeriodToUser,
    removePeriodFromUser,
    changeUserStatus,
    fetchUsersByRole,
    fetchCursos,
    fetchPeriodos,
    loading 
  };
};

export default useFirebase;