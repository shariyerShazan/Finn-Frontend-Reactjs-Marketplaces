/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useSendContactMessageMutation } from "@/redux/fetures/chat/contact";
// import { useSendContactMessageMutation } from "@/redux/features/contact/contactApi";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactUs = () => {
  const [sendMessage, { isLoading }] = useSendContactMessageMutation();


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await sendMessage(data).unwrap();
      if (response.success) {
        toast.success(response.message || "Message sent successfully!");
        reset();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send message. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-slate-600">
            Have questions? We're here to help you 24/7.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-[#0064AE]">
                <Phone size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Phone</p>
                <p className="text-slate-600 text-sm">+880 1234-567890</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-[#0064AE]">
                <Mail size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Email</p>
                <p className="text-slate-600 text-sm">support@finnapp.com</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-[#0064AE]">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Office</p>
                <p className="text-slate-600 text-sm">
                  Gulshan-2, Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Full Name *
                  </label>
                  <Input
                    {...register("name", { required: "Name is required" })}
                    placeholder="Your Name"
                    className={`bg-slate-50 border-none h-12 ${errors.name ? "ring-1 ring-red-500" : ""}`}
                  />
                  {errors.name && (
                    <span className="text-xs text-red-500">
                      {errors.name.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder="example@email.com"
                    className={`bg-slate-50 border-none h-12 ${errors.email ? "ring-1 ring-red-500" : ""}`}
                  />
                  {errors.email && (
                    <span className="text-xs text-red-500">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Subject *
                </label>
                <Input
                  {...register("subject", { required: "Subject is required" })}
                  placeholder="How can we help?"
                  className={`bg-slate-50 border-none h-12 ${errors.subject ? "ring-1 ring-red-500" : ""}`}
                />
                {errors.subject && (
                  <span className="text-xs text-red-500">
                    {errors.subject.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Message *
                </label>
                <Textarea
                  {...register("message", { required: "Message is required" })}
                  placeholder="Write your message here..."
                  className={`bg-slate-50 border-none min-h-[150px] ${errors.message ? "ring-1 ring-red-500" : ""}`}
                />
                {errors.message && (
                  <span className="text-xs text-red-500">
                    {errors.message.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer md:w-auto bg-[#0064AE] hover:bg-[#005291] px-10 h-12 text-lg transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} className="mr-2" /> Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
