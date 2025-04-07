import BackButton from '../../components/shared/BackButton';
import Panda from '../../assets/panda.jpg';

function PrivatePrivacy() {
    return (
        <div className=" bg-background min-h-screen">
            <div className="absolute top-32 sm:left-14 left-4" >
                <BackButton />
            </div>
            <section className="pt-24 container mx-auto sm:px-0 px-4">
                <div className="flex flex-row flex-wrap container justify-between mx-auto text-secondary space-y-4 py-32">
                    <div className="lg:w-[43%] space-y-4 flex flex-col justify-center">
                        <h1 className="font-poppins">PRIVACY POLICY</h1>
                        <h1 className="font-poppins text-4xl font-bold text-heading">We respect your privacy</h1>
                        <p>
                            At Studdy Spotter, we respect your privacy and are committed to protecting your information. As amateur programmers with limited backend knowledge, we strive to safeguard your data while continuing to learn and improve.
                        </p>
                        <p>
                            <span className="font-bold">🔒 What We Collect: </span>We collect basic details such as your username, email address, and ratings of study spots to enhance your app experience.
                        </p>
                        <p>
                            <span className="font-bold">🛡 Password Security: </span>We strongly recommend using a unique password for our app and not reusing passwords from other sites to ensure your security.
                        </p>
                        <p>
                            <span className="font-bold">🔄 Data Usage: </span>Your data helps us improve the app and is not shared with third parties unless required by law. We do use third-party services to support app functionality.
                        </p>
                        <p >
                            If you have any questions or concerns, feel free to contact us at
                            <span className="font-bold"> support_studdyspotter@gmail.com</span>
                        </p>
                    </div>

                    <div className="flex items-center justify-center sm:w-[40%] w-full  sm:pt-0 pt-12">
                        <img src={Panda} className="h-full w-full flex flex-col items-center py-12 rounded-lg" alt="University Quad">
                                                </img>
                    </div>
                </div>
            </section >
        </div >
    )
}

export default PrivatePrivacy