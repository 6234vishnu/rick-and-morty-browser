import React, { useEffect, useState } from "react";
import { User, MapPin, Calendar, Globe } from "lucide-react";
import api from "../services/axiosInstance";
import ErrorModal from "./ErrorModal";
import Pagination from "./Pagination";
import LoadingSpinner from "./LoadingSpinner";
import SearchBar from "./SearchBar";

// type diclaration of the charecter data
interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: { name: string };
  location: { name: string };
  image: string;
  episode: string[];
  created: string;
}
interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}
const statusColor = (s: string) =>
  ({
    alive: "text-green-600 bg-green-100",
    dead: "text-red-600 bg-red-100",
  }[s.toLowerCase()] || "text-gray-600 bg-gray-100");

const CharacterList: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // fetching the data from the api to list charecters
  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/character?page=${page}`);
      setData(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Server error"); // hadiling errors if couldint get data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleCloseError = () => {
    setError("");
    if (!data) setLoading(true);
  };


  // get the filterd result according to the search
  const filteredResults =
    data?.results.filter((c) =>
      [c.name, c.species, c.status].some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) || [];


    // if in case of loading or couldint get the data from backend
  if (loading || !data)
    return (
      <>
        {error && <ErrorModal message={error} onClose={handleCloseError} />}
        <LoadingSpinner />
      </>
    );

    // To show the total counts...
  const stats = [
    { label: "Total Characters", value: data.info.count },
    { label: "Total Pages", value: data.info.pages },
    { label: "Current Page", value: page },
  ];

  const characterDetails = [
    {
      icon: User,
      text: (c: Character) => `${c.species}${c.type ? ` • ${c.type}` : ""}`,
    },
    { icon: Globe, text: (c: Character) => c.gender },
    { icon: MapPin, text: (c: Character) => `Origin: ${c.origin.name}` },
    { icon: MapPin, text: (c: Character) => `Location: ${c.location.name}` },
    {
      icon: Calendar,
      text: (c: Character) =>
        `${c.episode.length} episode${c.episode.length !== 1 ? "s" : ""}`,
    },
  ];

  return (
    <div className="min-h-screen w-screen bg-white">
     <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 -z-10  h-full"></div>


      <SearchBar onSearch={setSearchTerm} />
      <div className="max-w-7xl mx-auto text-center mb-8 transform transition-all duration-700 hover:scale-105">
        <h1 className="text-4xl font-bold text-black mb-2">
          Rick and Morty Characters
        </h1>
        <p className="text-gray-600">
          Showing {data.results.length} of {data.info.count}
        </p>
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 mb-8 border border-gray-100 transform hover:scale-105">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm text-center">
          {stats.map((item, index) => (
            <div
              key={index}
              className="transform transition-all duration-300 hover:scale-110"
            >
              <div className="font-semibold text-gray-700 mb-1">
                {item.label}
              </div>
              <div className="text-3xl font-bold text-black">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredResults.length > 0 ? (
          filteredResults.map((c, index) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:scale-105 hover:-translate-y-2"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor(
                      c.status
                    )} shadow-lg`}
                  >
                    <span className="ml-1">{c.status}</span>
                  </span>
                </div>
              </div>

              <div className="p-6 text-sm text-gray-700 space-y-3">
                <h3 className="text-xl font-bold text-black mb-2 hover:text-gray-700">
                  {c.name}
                </h3>
                <p className="text-gray-600 font-medium">ID: {c.id}</p>

                <div className="space-y-2">
                  {characterDetails.map((detail, i) => (
                    <div key={i} className="flex items-center hover:text-black">
                      <detail.icon className="w-4 h-4 mr-2 text-gray-500" />
                      {detail.text(c)}
                    </div>
                  ))}
                </div>

                <div className="text-xs text-gray-500 pt-3 border-t border-gray-200 hover:text-black">
                  Created:{" "}
                  {new Date(c.created).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 text-lg">
            No characters found.
          </p>
        )}
      </div>

      <div className="max-w-7xl mx-auto">
        <Pagination
          page={page}
          totalPages={data.info.pages}
          hasPrev={!!data.info.prev}
          hasNext={!!data.info.next}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
        />
      </div>

      {error && <ErrorModal message={error} onClose={handleCloseError} />}
    </div>
  );
};

export default CharacterList;
