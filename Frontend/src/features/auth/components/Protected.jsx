import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

/**
 * role: "buyer" | "seller" | "any"
 * "any" = any authenticated user can access (e.g. /cart for both buyers & sellers)
 */
const Protected = ({ children, role = "buyer" }) => {

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    if (role !== "any" && user.role !== role) {
        return <Navigate to="/" />
    }

    return children

}

export default Protected