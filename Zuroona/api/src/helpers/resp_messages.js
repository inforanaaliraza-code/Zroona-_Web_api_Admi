
module.exports = (lang = "en") => {
    const login_success = {
        en: "login successfully",
        ar: "تسجيل الدخول بنجاح"
    };

    const logout = {
        en: "Logout successfully",
        ar: "تم تسجيل الخروج بنجاح"
    };
    const user_not_found = {
        en: "User not found.",
        ar: "لم يتم العثور على المستخدم"
    }
    const otp_sent_on_mail = {
        en: "OTP sent on given Email Address",
        ar: "تم إرسال OTP على البريد الإلكتروني المعطى"
    };

    const invalid_credentials = {
        en: "Invalid credentials",
        ar: "بيانات الاعتماد غير صالحة"
    };
    const internalServerError = {
        en: "Internal server error.",
        ar: "خطأ في الخادم الداخلي."
    };

    const email_not_verified = {
        en: "Please verify your email address before logging in. Check your inbox for the verification link.",
        ar: "يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول. تحقق من صندوق الوارد الخاص بك للعثور على رابط التحقق."
    };

    const account_pending_approval = {
        en: "Your account is pending admin approval. You will be notified via email once approved.",
        ar: "حسابك قيد انتظار موافقة المسؤول. سيتم إعلامك عبر البريد الإلكتروني عند الموافقة."
    };

    const account_rejected = {
        en: "Your account application was rejected. Please contact support for more information.",
        ar: "تم رفض طلب حسابك. يرجى الاتصال بالدعم للحصول على مزيد من المعلومات."
    };

    const account_not_approved = {
        en: "Your account is not yet approved. Please wait for admin approval.",
        ar: "لم تتم الموافقة على حسابك بعد. يرجى الانتظار حتى تتم الموافقة من قبل المشرف."
    };

    const token_required = {
        en: "Verification token is required",
        ar: "رمز التحقق مطلوب"
    };

    const invalid_token = {
        en: "Invalid or expired verification link",
        ar: "رابط التحقق غير صالح أو منتهي الصلاحية"
    };

    const already_verified = {
        en: "Email already verified. You can login now.",
        ar: "البريد الإلكتروني مُؤكد بالفعل. يمكنك تسجيل الدخول الآن."
    };

    const verification_success = {
        en: "Email and phone verified successfully! You can now login.",
        ar: "تم تأكيد البريد الإلكتروني ورقم الهاتف بنجاح! يمكنك الآن تسجيل الدخول."
    };

    const verification_email_sent = {
        en: "A verification link has been sent to your email and OTP to your phone. Please verify your account.",
        ar: "تم إرسال رابط التحقق إلى بريدك الإلكتروني ورمز التحقق إلى هاتفك. يرجى التحقق من حسابك."
    };

    const otpWaitMessage = {
        en: "Please wait 30 seconds before requesting another OTP.",
        ar: "يرجى الانتظار 30 ثانية قبل طلب رمز OTP آخر."
    }
    const currentPasswordWrong = {
        en: "Current password is wrong.",
        ar: "كلمة المرور الحالية غير صحيحة."
    };
    const newPasswordSameAsCurrent = {
        en: "New password and current password are the same.",
        ar: "كلمة المرور الجديدة هي نفسها كلمة المرور الحالية."
    };
    const passwordChangeSuccess = {
        en: "The password has been changed successfully.",
        ar: "تم تغيير كلمة المرور بنجاح."
    };
    const passwordResetSuccess = {
        en: "Password reset success.",
        ar: "تم إعادة تعيين كلمة المرور بنجاح."
    }

    const notAuthorizedAdmin = {
        en: "Not authorized as an admin.",
        ar: "غير مصرح له كمسؤول."
    };
    const notAuthorizedOrganizer = {
        en: "Not authorized as an organizer.",
        ar: "غير مصرح له كمنظم."
    };
    const eventNotFound = {
        en: "Event not found.",
        ar: "الحدث غير موجود."
    };
    const cmsTypeRequired = {
        en: "CMS type required.",
        ar: "نوع نظام إدارة المحتوى مطلوب."
    };
    const cmsNotFound = {
        en: "CMS not found.",
        ar: "نظام إدارة المحتوى غير موجود."
    };
    const invalid_otp = {
        en: "Invalid OTP",
        ar: "OTP غير صالح"
    };
    const otp_verified = {
        en: "OTP verified successfully!",
        ar: "تم التحقق من OTP بنجاح!"
    };

    const update_success = {
        en: "updated successfully!",
        ar: "تم التحديث بنجا��!"
    };

    const id_required = {
        en: "Id is required!",
        ar: "مطلوب معرف!"
    };

    const fetched_data = {
        en: "Fetched data successfully.",
        ar: "تم جلب البيانات بنجاح."
    };

    const profile_access = {
        en: "Profile access successfully.",
        ar: "تم الوصول إلى الملف الشخصي بنجاح"
    }
    const organizerExists = {
        en: "Organizer already exists.",
        ar: "المُنظّم موجود بالفعل."
    };

    const registration_success = {
        en: "registration successfully !",
        ar: "التسجيل بنجاح!"
    };
    const userNotVerified = {
        en: "Waiting for admin approve.",
        ar: "لم يتم التحقق من المستخدم."
    };
    const incorrectOTP = {
        en: "Incorrect OTP",
        ar: "OTP ��ير ��حيح"
    }
    const otpVerifiedSuccess = {
        en: "OTP verified successfully.",
        ar: "تم التحقق من OTP بنجاح."
    };
    const profileUpdated = {
        en: "Profile updated successfully.",
        ar: "تم تحديث الملف الشخصي بنجاح."
    };
    const otp_sent_phone = {
        en: "OTP sent successfully to your phone number",
        ar: "تم إرسال رمز التحقق بنجاح إلى رقم هاتفك"
    };

    const payment_verified = {
        en: "Payment verified successfully",
        ar: "تم التحقق من الدفع بنجاح"
    };

    const payment_signature_secret_missing = {
        en: "Payment signature secret is not configured",
        ar: "مفتاح توقيع الدفع غير مُكوّن"
    };

    const payment_fields_required = {
        en: "order_id, payment_id and signature are required",
        ar: "مطلوب order_id و payment_id و signature"
    };

    const invalid_payment_signature = {
        en: "Invalid payment signature",
        ar: "توقيع الدفع غير صالح"
    };

    const webhook_already_processed = {
        en: "Webhook already processed.",
        ar: "تمت معالجة الويب هوك بالفعل."
    };

    const webhook_processed = {
        en: "Webhook processed successfully.",
        ar: "تمت معالجة الويب هوك بنجاح."
    };

    const webhook_processing_error = {
        en: "An error occurred while processing the webhook.",
        ar: "حدث خطأ أثناء معالجة الويب هوك."
    };

    const payment_capture_failed = {
        en: "Failed to capture payment.",
        ar: "فشل في تحصيل الدفع."
    };

    const refund_booking_not_cancelled = {
        en: "Refund can only be requested for cancelled bookings",
        ar: "يمكن طلب الاسترداد فقط للحجوزات الملغاة"
    };

    const refund_booking_not_paid = {
        en: "Refund can only be requested for paid bookings",
        ar: "يمكن طلب الاسترداد فقط للحجوزات المدفوعة"
    };

    const refund_request_pending = {
        en: "Refund request already submitted and pending review",
        ar: "تم إرسال طلب الاسترداد وهو قيد المراجعة"
    };

    const refund_request_approved = {
        en: "Refund request already approved",
        ar: "تمت الموافقة على طلب الاسترداد بالفعل"
    };

    const refund_request_rejected = {
        en: "Refund request was rejected",
        ar: "تم رفض طلب الاسترداد"
    };

    const refund_already_processed = {
        en: "Refund already processed",
        ar: "تم معالجة الاسترداد بالفعل"
    };

    const refund_creation_failed = {
        en: "Failed to create refund request. Please try again.",
        ar: "فشل في إنشاء طلب الاسترداد. حاول مرة أخرى."
    };

    const eventAdded = {
        en: "Event added successfully.",
        ar: "تمت إضافة الحدث بنجاح."
    };
    const invalidEventId = {
        en: "Invalid event ID.",
        ar: "معرف الحدث غير صالح."
    };

    const eventUpdated = {
        en: "Event updated successfully.",
        ar: "تم تحديث الحدث بنجاح."
    };
    const eventDeleted = {
        en: "Event deleted successfully.",
        ar: "تم حذف الحدث بنجاح."
    };
    const bookingNotFound = {
        en: "Booking not found.",
        ar: "لم يتم العثور على الحجز."
    };
    const bookingStatusUpdated = {
        en: "Booking status updated successfully.",
        ar: "تم تحديث حالة الحجز بنجاح."
    };
    const accepted = {
        en: "has been accepted.",
        ar: "تم قبوله."
    };
    const rejected = {
        en: "has been rejected.",
        ar: "تم رفضه."
    };
    const eventNotification = {
        en: "Your event",
        ar: "الحدث الخاص بك"
    };
    const accepted_key = {
        en: "accepted",
        ar: "مقبول"
    }
    const rejected_key = {
        en: "rejected",
        ar: "مرفوض"
    }
    const account_exist = {
        en: "Account already exists.",
        ar: "الحساب موجود بالفعل."
    }
    const otp_wait_msg = {
        en: "Please wait 30 seconds before requesting another OTP",
        ar: "يرجى الانتظار 30 ثانية قبل طلب كلمة المرور لمرة واحدة (OTP) أخرى"
    }

    const profileDelete = {
        en: "Profile deleted successfully.",
        ar: "تم حذف الملف الشخصي بنجا��."
    }
    const data_not_found = {
        en: "Data not found.",
        ar: "لم يتم العثور على البيانات."
    }
    const book_limit_exceeded = {
        en: 'Seats not available',
        ar: 'عدد ال��ماكن المتوفرة'
    }
    const event_type_welcome = {
        en: 'Welcome',
        ar: 'مرحبا��'
    }
    const event_type_join_us = {
        en: 'Join us',
        ar: 'انضم ��لينا'
    }
    const event_booked_request = {
        en: 'booked request',
        ar: 'طلب الحجز'
    }
    const booked_event = {
        en: "Booked the",
        ar: "حجز ال"
    }
    const booking_successful = {
        en: "booking successful",
        ar: "تم الحجز بنجا��"
    }
    const addReview = {
        en: "Review Added successfully",
        ar: "تمت ��ضافة التقييم بنجا��"
    }
    const insufficient_funds = {
        en: "Insufficient funds",
        ar: "الأموال غير كافية"
    }
    const withdrawalSuccess = {
        en: "The amount has been successfully withdrawn. Within 24 hours, the amount will be credited to your account.",
        ar: "تم سحب المبلغ بنجاح. في غضون 24 ساعة، سيتم إيداع المبلغ في حسابك."
    }
    const request_already_processed = {
        en: "Request already processed",
        ar: "الطلب م��ت��حصل عليه"
    }
    const otp_send_failed = {
        en: "Failed to send OTP. Please try again later.",
        ar: "فشل إرسال رمز التحقق. الرجاء المحاولة مرة أخرى لاحقًا."
    }
    const invalid_refund_id = {
        en: "Invalid refund ID format",
        ar: "صيغة معرف الاسترداد غير صالحة"
    }
    const password_reset_failed = {
        en: "Failed to send password reset email. Please try again later.",
        ar: "فشل إرسال بريد إعادة تعيين كلمة المرور. حاول مرة أخرى لاحقًا."
    }
    return {
        request_already_processed: request_already_processed[lang],
        withdrawalSuccess: withdrawalSuccess[lang],
        insufficient_funds: insufficient_funds[lang],
        addReview: addReview[lang],
        booking_successful: booking_successful[lang],
        booked_event: booked_event[lang],
        event_booked_request: event_booked_request[lang],
        event_type_welcome: event_type_welcome[lang],
        event_type_join_us: event_type_join_us[lang],
        book_limit_exceeded: book_limit_exceeded[lang],
        data_not_found: data_not_found[lang],
        profileDelete: profileDelete[lang],
        otp_wait_msg: otp_wait_msg[lang],
        account_exist: account_exist[lang],
        accepted_key: accepted_key[lang],
        rejected_key: rejected_key[lang],
        bookingNotFound: bookingNotFound[lang],
        bookingStatusUpdated: bookingStatusUpdated[lang],
        accepted: accepted[lang],
        rejected: rejected[lang],
        eventNotification: eventNotification[lang],
        invalidEventId: invalidEventId[lang],
        eventAdded: eventAdded[lang],
        eventDeleted: eventDeleted[lang],
        eventUpdated: eventUpdated[lang],
        otp_sent_phone: otp_sent_phone[lang],
        payment_verified: payment_verified[lang],
        payment_signature_secret_missing: payment_signature_secret_missing[lang],
        payment_fields_required: payment_fields_required[lang],
        invalid_payment_signature: invalid_payment_signature[lang],
        webhook_already_processed: webhook_already_processed[lang],
        webhook_processed: webhook_processed[lang],
        webhook_processing_error: webhook_processing_error[lang],
        payment_capture_failed: payment_capture_failed[lang],
        refund_booking_not_cancelled: refund_booking_not_cancelled[lang],
        refund_booking_not_paid: refund_booking_not_paid[lang],
        refund_request_pending: refund_request_pending[lang],
        refund_request_approved: refund_request_approved[lang],
        refund_request_rejected: refund_request_rejected[lang],
        refund_already_processed: refund_already_processed[lang],
        refund_creation_failed: refund_creation_failed[lang],
        otp_send_failed: otp_send_failed[lang],
        invalid_refund_id: invalid_refund_id[lang],
        password_reset_failed: password_reset_failed[lang],
        profileUpdated: profileUpdated[lang],
        otpVerifiedSuccess: otpVerifiedSuccess[lang],
        incorrectOTP: incorrectOTP[lang],
        userNotVerified: userNotVerified[lang],
        registration_success: registration_success[lang],
        organizerExists: organizerExists[lang],
        profile_access: profile_access[lang],
        fetched_data: fetched_data[lang],
        id_required: id_required[lang],
        update_success: update_success[lang],
        otp_verified: otp_verified[lang],
        invalid_otp: invalid_otp[lang],
        cmsNotFound: cmsNotFound[lang],
        cmsTypeRequired: cmsTypeRequired[lang],
        eventNotFound: eventNotFound[lang],
        notAuthorizedAdmin: notAuthorizedAdmin[lang],
        notAuthorizedOrganizer: notAuthorizedOrganizer[lang],
        passwordResetSuccess: passwordResetSuccess[lang],
        currentPasswordWrong: currentPasswordWrong[lang],
        newPasswordSameAsCurrent: newPasswordSameAsCurrent[lang],
        passwordChangeSuccess: passwordChangeSuccess[lang],
        otpWaitMessage: otpWaitMessage[lang],
        login_success: login_success[lang],
        logout: logout[lang],
        invalid_credentials: invalid_credentials[lang],
        user_not_found: user_not_found[lang],
        internalServerError: internalServerError[lang],
        otp_sent_on_mail: otp_sent_on_mail[lang],
        email_not_verified: email_not_verified[lang],
        account_pending_approval: account_pending_approval[lang],
        account_rejected: account_rejected[lang],
        account_not_approved: account_not_approved[lang],
        token_required: token_required[lang],
        invalid_token: invalid_token[lang],
        already_verified: already_verified[lang],
        verification_success: verification_success[lang],
        verification_email_sent: verification_email_sent[lang],

    }
}