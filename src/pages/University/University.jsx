import { fetchUniversityData } from '../../services/University/University'
import { useEffect, useState } from 'react'
import { fetchUniversityStudyLocations } from '../../services/StudyLocation/Study'

function University() {
    const [uniData, setUniData] = useState(null)
    const [studyLocations, setStudyLocations] = useState(null)

    useEffect(() => {
        // Extract the university name from the URL
        const universityNameFromURL = window.location.pathname.split('/').pop();

        // Fetch university data using the extracted name
        fetchUniversityData(universityNameFromURL).then((data) => {
            setUniData(data)
        }).catch(error => console.error(error));

    }, [])

    useEffect(() => {
        if (uniData) {
            // Extract the uni ID to pass to fetchUniversityStudyLocations
            const universityID = uniData ? uniData[0].id : null

            fetchUniversityStudyLocations(universityID).then((data) => {
                setStudyLocations(data)
            }
            ).catch(error => console.error(error));
        }
    }, [uniData])


    // Loading 
    const loading = () => {
        return (
            <div role="status" className="flex items-center justify-center h-screen ">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>

        )
    }

    return (
        <div className="pt-20">
            {uniData ? uniData.map((uni) => {
                return (
                    <div key={uni.id} style={{ backgroundImage: `url(${uni.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '45vh', width: '100%' }}>
                        <div className="lg:w-1/3 w-1/2 bg-purple-800/75 h-full font-lato flex flex-col items-center justify-center lg:px-12 px-4 gap-4">
                            <h1 className="text-white font-bold lg:text-4xl text-2xl text-center">{uni.name}</h1>
                            <div className="">
                                <h1 className="text-white font-bold lg:text-2xl text-lg text-center">{uni.city},</h1>
                                <h1 className="text-white font-bold lg:text-2xl text-lg text-center">{uni.States.name}</h1>
                            </div>
                        </div>

                    </div>
                )
            }) : loading()}
            <div className="bg-primary font-secondary ">
                <div className=" container mx-auto flex flex-col gap-4 py-8">
                    <h1 className="font-poppins font-semibold text-xl"> Popular Study Spots</h1>


                    <h1 className="font-poppins font-semibold text-xl"> Explore</h1>
                    <div>
                        {studyLocations ? studyLocations.map((studyLocation) => {
                            return (
                                <div key={studyLocation.id} className="bg-white rounded-lg shadow-lg p-4 flex flex-col gap-4">
                                    <div className="h-40 w-full bg-gray-200 rounded-lg"></div>
                                    <div className="flex flex-col gap-2">
                                        <h1 className="font-bold text-lg">{studyLocation.name}</h1>
                                        <h1 className="font-light text-sm">{studyLocation.address}</h1>
                                        <img src={studyLocation.image_url} alt="placeholder" className="h-40 w-full object-cover rounded-lg" />
                                    </div>
                                </div>
                            )

                        }) : loading()}
                    </div>

                </div>

            </div>
        </div>
    )
}

export default University