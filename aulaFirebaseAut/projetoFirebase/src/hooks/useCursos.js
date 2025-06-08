// src/hooks/useCursos.js
import { useState } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/credenciaisFirebase';

const useCursos = () => {
  const [loading, setLoading] = useState(false);

  const addCurso = async (data) => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'cursos'), {
        ...data,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar curso:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchCursos = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'cursos'));
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCursoById = async (id) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'cursos', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar curso:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCurso = async (id, data) => {
    setLoading(true);
    try {
      const cursoRef = doc(db, 'cursos', id);
      await updateDoc(cursoRef, {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Erro ao atualizar curso:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCurso = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'cursos', id));
    } catch (error) {
      console.error("Erro ao deletar curso:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { 
    addCurso, 
    fetchCursos, 
    getCursoById, 
    updateCurso, 
    deleteCurso, 
    loading 
  };
};

export default useCursos;