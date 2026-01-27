/**
 * Career Controller
 * Handles career page and job application endpoints
 */

const Response = require('../helpers/response');
const CareerApplicationService = require('../services/careerApplicationService');
const emailService = require('../helpers/emailService');
const resp_messages = require('../helpers/resp_messages');

const CareerController = {
    /**
     * Submit job application
     * POST /api/career/apply
     */
    submitApplication: async (req, res) => {
        const lang = req.headers["lang"] || "en";
        try {
            const { first_name, last_name, email, phone_number, position, cover_letter, resume_url } = req.body;

            // Validation
            if (!first_name || !last_name || !email || !position || !cover_letter) {
                return Response.validationErrorResponse(
                    res,
                    "First name, last name, email, position, and cover letter are required"
                );
            }

            // Email validation
            const emailRegex = /^\S+@\S+\.\S+$/;
            if (!emailRegex.test(email)) {
                return Response.validationErrorResponse(
                    res,
                    "Please enter a valid email address"
                );
            }

            // Create application
            const application = await CareerApplicationService.CreateService({
                first_name: first_name.trim(),
                last_name: last_name.trim(),
                email: email.toLowerCase().trim(),
                phone_number: phone_number ? phone_number.trim() : null,
                position: position.trim(),
                cover_letter: cover_letter.trim(),
                resume_url: resume_url || null,
                status: 0, // Pending
            });

            // Send confirmation email to applicant
            try {
                const emailHtml = emailService.renderCareerApplicationConfirmation(
                    `${first_name} ${last_name}`,
                    position,
                    lang
                );
                const subject = lang === "ar"
                    ? "تم استلام طلب التوظيف - Zuroona"
                    : "Job Application Received - Zuroona";

                await emailService.send(email, subject, emailHtml);
            } catch (emailError) {
                console.error("[CAREER] Error sending confirmation email:", emailError);
                // Don't fail the request if email fails
            }

            // Send notification email to admin (optional)
            const adminEmail = process.env.ADMIN_EMAIL || process.env.CAREER_EMAIL;
            if (adminEmail) {
                try {
                    const adminEmailHtml = emailService.renderCareerApplicationNotification(
                        `${first_name} ${last_name}`,
                        email,
                        position,
                        cover_letter,
                        lang
                    );
                    const adminSubject = lang === "ar"
                        ? "طلب توظيف جديد - Zuroona"
                        : "New Job Application - Zuroona";

                    await emailService.send(adminEmail, adminSubject, adminEmailHtml);
                } catch (adminEmailError) {
                    console.error("[CAREER] Error sending admin notification:", adminEmailError);
                }
            }

            return Response.ok(
                res,
                {
                    application_id: application._id,
                    message: "Application submitted successfully"
                },
                201,
                lang === "ar"
                    ? "تم إرسال طلب التوظيف بنجاح. سنتواصل معك قريباً."
                    : "Application submitted successfully. We will contact you soon."
            );
        } catch (error) {
            console.error("[CAREER] Error submitting application:", error);
            return Response.serverErrorResponse(
                res,
                resp_messages(lang).internalServerError || "Internal server error"
            );
        }
    },

    /**
     * Get available positions (for careers page)
     * GET /api/career/positions
     */
    getPositions: async (req, res) => {
        const lang = req.headers["lang"] || "en";
        try {
            // Define available positions
            const positions = [
                { id: 'software-engineer', name: lang === 'ar' ? 'مهندس برمجيات' : 'Software Engineer' },
                { id: 'frontend-developer', name: lang === 'ar' ? 'مطور واجهة أمامية' : 'Frontend Developer' },
                { id: 'backend-developer', name: lang === 'ar' ? 'مطور خلفية' : 'Backend Developer' },
                { id: 'fullstack-developer', name: lang === 'ar' ? 'مطور كامل المكدس' : 'Full Stack Developer' },
                { id: 'ui-ux-designer', name: lang === 'ar' ? 'مصمم واجهة المستخدم' : 'UI/UX Designer' },
                { id: 'product-manager', name: lang === 'ar' ? 'مدير المنتج' : 'Product Manager' },
                { id: 'marketing-specialist', name: lang === 'ar' ? 'أخصائي تسويق' : 'Marketing Specialist' },
                { id: 'customer-support', name: lang === 'ar' ? 'دعم العملاء' : 'Customer Support' },
            ];

            return Response.ok(
                res,
                { positions },
                200,
                "Positions retrieved successfully"
            );
        } catch (error) {
            console.error("[CAREER] Error getting positions:", error);
            return Response.serverErrorResponse(
                res,
                resp_messages(lang).internalServerError || "Internal server error"
            );
        }
    },
};

module.exports = CareerController;

