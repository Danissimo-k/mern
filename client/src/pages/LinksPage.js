import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Loader} from '../components/loader'
import {LinksList} from '../components/linksList'

export const LinksPage = () => {
  const [links, setLinks] = useState([])
  const {loading, request} = useHttp()
  const {token} = useContext(AuthContext)

  const fetchLinks = useCallback(async () => {
    try {
      const fetched = await request('/api/link', 'GET', null, {
        Authorization: `Bearer ${token}`
      })
      setLinks(fetched)
    } catch (e) {}
  }, [token, request])

  useEffect(() => {
    fetchLinks()
    const ac = new AbortController()
    ac.abort()
  }, [fetchLinks])

  if (loading) {
    return <Loader/>
  }

  return (
    <>
      {!loading && <LinksList links={links} />}
    </>
  )
}
