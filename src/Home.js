import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import PaginationComponent from './Pagination';

const Home = () => {
    const [data, setData] = useState([]);
    const [reload, setReload] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [email, setEmail] = useState();

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        axios.get(`http://localhost:3001/api/users/filter?email=${email}`).then((res) => {
            console.log(res);
            setData(res.data);
        });
    };

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:3001/api/users/${id}`)
            .then(() => {
                setReload(reload + 1);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        fetchData();
        console.log(totalPages, 'qwe');
    }, [currentPage, reload]);
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/users/?_page=${currentPage}&_limit=8`);
            setData(response.data.data);
            console.log(response);
            setTotalPages(Math.ceil(response.data.pagination['_totalRows'] / 8));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    return (
        <div className="d-flex flex-column justify-content-center align-items-center bg-light ">
            <div className="w-75 rounded pt-0 bg-white border shadow p-4">
                <p className="text-left py-3 w-100">Danh sách người dùng</p>
                <hr></hr>
                <nav className="navbar navbar-light bg-light">
                    <div className="d-flex gap-2">
                        <button
                            onClick={() => {
                                handleSearch(email);
                            }}
                            className=" btn btn-outline-success my-2 my-sm-0"
                            type="submit"
                        >
                            Search
                        </button>
                        <input
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            value={email}
                            classNamde="w-50 form-control mr-sm-2 "
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                        />
                    </div>
                </nav>

                <table className="table table-striped table-bordered">
                    <thead>
                        <tr className="bg-secondary">
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Birthday</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.birthday}</td>
                                <td>
                                    <button onClick={() => handleDelete(item.id)} className="btn btn-danger">
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button key={page} onClick={() => handlePageChange(page)} disabled={page === currentPage}>
                            {page}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
