// src/hooks/usePeriodos.js
import { useState } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/credenciaisFirebase';

const usePeriodos = () => {
  const [loading, setLoading] = useState(false);

  const addPeriodo = async (data) => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'periodos'), {
        ...data,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar período:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchPeriodos = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'periodos'));
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erro ao buscar períodos:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getPeriodoById = async (id) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'periodos', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar período:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePeriodo = async (id, data) => {
    setLoading(true);
    try {
      const periodoRef = doc(db, 'periodos', id);
      await updateDoc(periodoRef, {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Erro ao atualizar período:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePeriodo = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'periodos', id));
    } catch (error) {
      console.error("Erro ao deletar período:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { 
    addPeriodo, 
    fetchPeriodos, 
    getPeriodoById, 
    updatePeriodo, 
    deletePeriodo, 
    loading 
  };
};

export default usePeriodos;